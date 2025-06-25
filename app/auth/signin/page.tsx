'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/app' });
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <FcGoogle className="h-5 w-5" />
            )}
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col">
          {/* <Separator className="my-4" />
          <p className="text-sm text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p> */}
        </CardFooter>
      </Card>
    </div>
  );
}
