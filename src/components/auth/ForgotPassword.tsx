
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeftIcon } from "lucide-react";

type ForgotPasswordStep = 'email' | 'otp' | 'new-password';

const ForgotPassword: React.FC = () => {
  const { toast } = useToast();
  const [step, setStep] = useState<ForgotPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send password reset email with OTP
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Reset Code Sent",
          description: "Please check your email for the password reset code.",
        });
        setStep('otp');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length === 6) {
      toast({
        title: "Code Verified",
        description: "Your verification code has been confirmed. Please set a new password.",
      });
      setStep('new-password');
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter the complete 6-digit verification code.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password should be at least 8 characters long.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Update password using the OTP
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }
      
      toast({
        title: "Password Updated",
        description: "Your password has been reset successfully. You can now login with your new password.",
      });
      
      // Reset the form and go back to email step
      setEmail('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setStep('email');
      
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: "Error",
        description: "Failed to reset your password. Please try again or request a new reset code.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </div>
          </form>
        );
      
      case 'otp':
        return (
          <form onSubmit={handleOtpSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2 text-center">
                <Label htmlFor="otp">Enter Verification Code</Label>
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to {email}
                </p>
                <div className="flex justify-center py-4">
                  <InputOTP 
                    maxLength={6} 
                    value={otp} 
                    onChange={setOtp}
                    render={({ slots }) => (
                      <InputOTPGroup>
                        {slots.map((slot, index) => (
                          <InputOTPSlot key={index} {...slot} index={index} />
                        ))}
                      </InputOTPGroup>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={otp.length !== 6}>
                Verify Code
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('email')}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </form>
        );
      
      case 'new-password':
        return (
          <form onSubmit={handlePasswordSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating Password..." : "Reset Password"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={() => setStep('otp')}
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </form>
        );
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto">
      <CardHeader>
        <CardTitle>Reset Your Password</CardTitle>
        <CardDescription>
          {step === 'email' && "Enter your email address to receive a verification code."}
          {step === 'otp' && "Enter the verification code sent to your email."}
          {step === 'new-password' && "Create a new password for your account."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground">
          Remember your password? <a href="/login" className="text-gym-600 hover:underline">Log in</a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ForgotPassword;
