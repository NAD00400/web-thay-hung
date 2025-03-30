'use client'
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import React from 'react';
import Link from 'next/link';

const LoginPage = () => {
    return (
        
        <div className="flex min-h-screen items-center justify-center bg-white">
            <Card className="w-full max-w-md p-8 bg-neutral-50">
                <div className="mb-4">
                    <Label htmlFor="email" className='pl-1 mb-2'>Email</Label>
                    <Input
                        type="email"
                        id="email"
                        placeholder="Nhập email của bạn"
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="password" className='pl-1 mb-2'>Mật khẩu</Label>
                    <Input
                        type="password"
                        id="password"
                        placeholder="Nhập mật khẩu của bạn"
                    />
                </div>
                <Button type="submit" className="w-full bg-neutral-950">
                    Đăng Nhập
                </Button>
                <p className="mt-4 text-sm text-center text-neutral-600">
                    Chưa có tài khoản?{' '}
                    <Link href="/dang-ky" className="text-neutral-900 hover:underline">
                        Đăng ký
                    </Link>
                </p>
            </Card>
        </div>
        
    );
};

export default LoginPage;
