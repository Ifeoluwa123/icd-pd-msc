'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Header from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Mail } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const professionalDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'medicalProfessionals', user.uid);
  }, [firestore, user]);

  const { data: professionalData, isLoading: isProfileLoading } = useDoc(professionalDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const isLoading = isUserLoading || isProfileLoading;

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name[0];
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 justify-center p-4 pt-10 md:p-6 md:pt-12">
        <div className="w-full max-w-2xl space-y-8">
            <div className="text-center">
                <h1 className="font-headline text-3xl font-bold">My Profile</h1>
                <p className="text-muted-foreground">Your medical professional information.</p>
            </div>
          {isLoading ? (
            <ProfileSkeleton />
          ) : professionalData ? (
            <Card>
              <CardHeader className="items-center text-center border-b pb-6">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? ''} />
                  <AvatarFallback className="text-3xl">
                    {getInitials(user?.displayName)}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-3xl">{professionalData.firstName} {professionalData.lastName}</CardTitle>
                <CardDescription>{user?.displayName}</CardDescription>
              </CardHeader>
              <CardContent className="mt-6 space-y-4">
                <div className="flex items-start gap-4 rounded-lg border p-4">
                    <Mail className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-sm font-medium">Email Address</p>
                        <p className="text-muted-foreground">{professionalData.email}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4 rounded-lg border p-4">
                    <Building className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                        <p className="text-sm font-medium">Organization</p>
                        <p className="text-muted-foreground">{professionalData.organization}</p>
                    </div>
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card className="flex h-full min-h-[30vh] items-center justify-center">
                <CardContent className="text-center">
                    <p className="text-muted-foreground">Could not load profile data. Please try again later.</p>
                </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

const ProfileSkeleton = () => (
    <Card>
        <CardHeader className="items-center text-center border-b pb-6">
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent className="mt-6 space-y-4">
            <div className="flex items-start gap-4 rounded-lg border p-4">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
            </div>
             <div className="flex items-start gap-4 rounded-lg border p-4">
                <Skeleton className="h-6 w-6 rounded" />
                <div className="w-full space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-5 w-1/2" />
                </div>
            </div>
        </CardContent>
    </Card>
);
