'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import AdminHeader from '@/components/admin/header';
import UserTable from '@/components/admin/user-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
        router.push('/admin/login');
        return;
    }

    user.getIdTokenResult()
        .then((idTokenResult) => {
            if (idTokenResult.claims.admin) {
                setIsAdmin(true);
            } else {
                router.push('/');
            }
        })
        .catch(() => {
             router.push('/');
        })
        .finally(() => {
            setIsCheckingAdmin(false);
        });

  }, [user, isUserLoading, router]);

  const professionalsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !isAdmin) return null;
    return collection(firestore, 'medicalProfessionals');
  }, [firestore, isAdmin]);

  const { data: professionals, isLoading: isLoadingProfessionals } = useCollection(professionalsCollectionRef);

  if (isCheckingAdmin || isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Redirecting...</p>
        </div>
      );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">User Accounts</h1>
            <p className="text-muted-foreground">
              A list of all medical professionals registered in the system.
            </p>
          </div>
          <Card>
              <CardContent className="p-0">
                {isLoadingProfessionals ? (
                    <div className="space-y-4 p-6">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                ) : (
                    <UserTable users={professionals} />
                )}
              </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
