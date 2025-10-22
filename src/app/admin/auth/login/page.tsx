'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { fromTheme } from 'tailwind-merge';
const LoginPage = () => {
  const router = useRouter();
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [emailErr,setEmailErr] = useState<boolean>(false)
  const [passwordErr,setPasswordErr] = useState<boolean>(false)
 const [agreeToTerms,setAgreeToTerms] = useState<boolean>(false)
  const [formData,setFormData] = useState({
    email:"",
    password:""
  })


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
 

  setFormData(prev => ({ ...prev, [name]: value }));

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  if (name === "email") {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const correct = valid.test(value);
    setEmailErr(!correct);
  }

  if (name === "password") {
    setPasswordErr(value.length < 7);
  }
};


  const handleUserLogin = async(e:React.FormEvent)=>{
    e.preventDefault()

    setLoading(true)
   try{
     const res = await fetch(`http://localhost:3004/admin?email=${formData.email}&Password=${formData.password}`,{
      method:'GET',
      headers:{
        'Content-Type':'application-json'
      },
     });
       
     const data = await res.json()

     //same work
        const admin = data.find(
        (item: any) =>
          formData.email === item.email && formData.password === item.password
      );


     localStorage.setItem('adminName',admin.name)
     localStorage.setItem('adminEmail',admin.email)
   console.log(data)
   setTimeout(()=>{
     if(data.length==0)
      {
        throw new Error('User Not Exists')
         
      }
     console.log('res',data)
     setLoading(false)
   
    router.push('/admin/dashboard')  

      toast("User Login Successfully", {
  description: "Welcome back!",
  position: "top-right",
  className: "text-green-500 text-sm font-medium ",

}); 
setLoading(false)
   },3000)
  const dataId = data[0]
 
    //  document.cookie = `auth=users.${dataId.id};`
     document.cookie = `auth=${dataId.id}; path=/; SameSite=Lax; Secure=false`;
   

}catch(error:any){
  setLoading(false)
      console.log(error.message)
       toast("Please Enter the Correct Email and Password", {
            position:'top-right',
          description:'Please check',
        }
      )
   }
  
  }


  //spinner

   function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
      <LoaderIcon
        role="status"
        aria-label="Loading"
        className={cn("size-4 animate-spin", className)}
        {...props}
        
      />
    )
  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back Admin!</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Card */}
        <Card>
        
          <CardContent className="space-y-4">
            

            {/* Login Form */}
            <form  className="space-y-4" onSubmit={handleUserLogin}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                     value={formData.email}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {/* {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )} */}

                {emailErr===true &&(
              <span className="text-sm text-red-500">
                Enter the Valid Email Id
              </span>
                 )
                }
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                     value={formData.password}
                     onChange={handleInputChange}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}

                {passwordErr && (
                  <p className='text-sm text-red-500'>Enter password MinLength 7</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {/* <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  /> */}

                  <Checkbox
                   id="terms"
                   checked={agreeToTerms}
                   onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />

                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                
              </div>
              
              {/* <Button type='submit' className="w-full cursor-pointer" disabled={!formData.email || !formData.password || loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button> */}

              {/* <Button type="submit" className="w-full cursor-pointer" disabled={loading || emailErr || passwordErr || !formData.email || !formData.password}>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button> */}
              {loading===false && (
              <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={
            loading ||
            emailErr ||
            passwordErr ||
            !formData.email ||
            !formData.password ||
            !agreeToTerms
          }
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>
              )}
        {loading && (
             <Button className='w-full '>         
              <Spinner />
        </Button>
                      )}  
            </form>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
