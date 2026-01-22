import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Truck, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from '@/hooks/use-toast';
import orderService from '@/services/orderService';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { isLoaded, isLoading, openPayment } = useRazorpay();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const shipping = totalPrice >= 100 ? 0 : 10;
  const tax = totalPrice * 0.18; // 18% GST
  const total = totalPrice + shipping + tax;

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to place an order.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.addressLine1 ||
      !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required shipping details.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);

      // Prepare order data - backend expects 'items' with product ID and quantity
      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        },
      };

      // Create order in backend - this will create Razorpay order
      const createOrderResponse = await orderService.createOrder(orderData);

      // Open Razorpay payment modal
      const razorpayOptions = {
        key: createOrderResponse.razorpayKeyId,
        amount: Math.round(total * 100), // Razorpay expects amount in paise
        currency: 'INR',
        name: 'OJAL Premium',
        description: `Order of ${items.length} item(s)`,
        order_id: createOrderResponse.razorpayOrderId,
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async function (response: any) {
          try {
            // Verify payment with backend
            await orderService.verifyPayment({
              orderId: createOrderResponse.order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast({
              title: 'Order Placed Successfully!',
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });

            clearCart();
            navigate('/');
          } catch (error: any) {
            console.error('Payment verification error:', error);
            toast({
              title: 'Payment Verification Failed',
              description: error.response?.data?.message || 'Please contact support with your payment ID.',
              variant: 'destructive',
            });
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast({
              title: 'Payment Cancelled',
              description: 'You cancelled the payment process.',
            });
          },
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(razorpayOptions);
        rzp.on('payment.failed', function (response: any) {
          setProcessing(false);
          toast({
            title: 'Payment Failed',
            description: response.error.description || 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK not loaded');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        items: items,
        orderData: orderData,
      });
      setProcessing(false);
      toast({
        title: 'Order Creation Failed',
        description: error.response?.data?.message || error.message || 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-2xl font-semibold mb-4">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some items to proceed to checkout.</p>
          <Button asChild>
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Breadcrumb */}
      <div className="bg-background border-b border-border py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/shop" className="hover:text-foreground transition-colors">
              Shop
            </Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-foreground">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="font-heading text-3xl font-semibold mb-8">Checkout</h1>

        {!user && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-sm">
              <Link to="/auth" className="text-primary font-medium hover:underline">
                Sign in
              </Link>{' '}
              to place your order and track it.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <Truck size={20} className="text-primary" />
                Shipping Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="Street address, P.O. box"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card rounded-xl p-6 shadow-soft">
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Payment
              </h2>
              <div className="space-y-4">
                <div className="bg-secondary/50 rounded-lg p-4 flex items-center gap-3">
                  <Wallet className="text-primary" size={24} />
                  <div>
                    <p className="font-medium">Razorpay Secure Payment</p>
                    <p className="text-sm text-muted-foreground">
                      Pay with UPI, PhonePe, Paytm, Credit/Debit Cards, Net Banking
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck size={16} className="text-primary" />
                  Your payment information is secure and encrypted
                </div>
                <Button
                  size="lg"
                  className="w-full mt-4"
                  onClick={handlePayment}
                  disabled={!isLoaded || isLoading || processing}
                >
                  {processing ? 'Processing...' : `Pay ₹${total.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 shadow-soft sticky top-24">
              <h2 className="font-heading text-xl font-semibold mb-6">
                Order Summary
              </h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium text-primary">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-heading text-lg font-semibold pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">₹{total.toFixed(2)}</span>
                </div>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-primary mt-4 text-center">
                  🎉 You qualify for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
