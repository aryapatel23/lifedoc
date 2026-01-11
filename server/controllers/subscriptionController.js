const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');

exports.createCheckoutSession = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        // Create customer if not exists
        let customerId = user.subscription.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name,
                metadata: { userId: user.id }
            });
            customerId = customer.id;
            user.subscription.stripeCustomerId = customerId;
            await user.save();
        }

        const { plan } = req.body;

        let unitAmount = 999; // Default Premium
        let planName = 'LifeDoc Premium';

        if (plan === 'plus') {
            unitAmount = 499;
            planName = 'LifeDoc Plus';
        } else if (plan === 'family') {
            unitAmount = 1999;
            planName = 'LifeDoc Family';
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'subscription',
            customer: customerId,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: planName,
                            description: 'Advanced Health Analytics & Priority Access',
                        },
                        unit_amount: unitAmount,
                        recurring: {
                            interval: 'month',
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/payment/cancel`,
            metadata: {
                userId: user.id,
                plan: plan || 'premium'
            }
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Stripe Session Error:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.warn("Stripe Webhook Secret not set. Skipping verification (UNSAFE).");
            event = req.body;
        } else {
            event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.metadata.userId;

            await User.findByIdAndUpdate(userId, {
                'subscription.plan': session.metadata.plan || 'premium',
                'subscription.status': 'active',
                'subscription.stripeSubscriptionId': session.subscription,
                'subscription.startDate': new Date(),
                'subscription.endDate': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        }

        // Handle recurring payments & Record History
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });

            if (user) {
                // Update User Subscription
                user.subscription.status = 'active';
                user.subscription.endDate = new Date(invoice.lines.data[0].period.end * 1000);
                await user.save();

                // Store Payment Record
                await Payment.create({
                    userId: user._id,
                    stripeCustomerId: customerId,
                    stripeInvoiceId: invoice.id,
                    stripePaymentIntentId: invoice.payment_intent,
                    amount: invoice.amount_paid,
                    currency: invoice.currency,
                    status: 'succeeded',
                    description: 'Premium Subscription Renewal',
                    paymentDate: new Date(invoice.created * 1000)
                });
            }
        }

        // Handle payment failure & Record History
        if (event.type === 'invoice.payment_failed') {
            const invoice = event.data.object;
            const customerId = invoice.customer;
            const user = await User.findOne({ 'subscription.stripeCustomerId': customerId });

            if (user) {
                user.subscription.status = 'past_due';
                await user.save();

                // Store Failed Payment Record
                await Payment.create({
                    userId: user._id,
                    stripeCustomerId: customerId,
                    stripeInvoiceId: invoice.id,
                    stripePaymentIntentId: invoice.payment_intent,
                    amount: invoice.amount_due,
                    currency: invoice.currency,
                    status: 'failed',
                    description: 'Subscription Payment Failed',
                    paymentDate: new Date(invoice.created * 1000)
                });
            }
        }

        res.json({ received: true });
    } catch (err) {
        console.error(err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

exports.getSubscriptionStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('subscription usage');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
