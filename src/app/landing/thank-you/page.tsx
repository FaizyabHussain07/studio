
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";


export default function ThankYouPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-secondary/50 px-4">
        <Card className="w-full max-w-lg text-center shadow-xl">
            <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="font-headline text-3xl mt-4">Thank You!</CardTitle>
                <CardDescription className="text-lg mt-2">
                    Your message has been sent successfully. We will get back to you as soon as possible.
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Button asChild>
                <Link href="/">
                Return to Home
                </Link>
            </Button>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
