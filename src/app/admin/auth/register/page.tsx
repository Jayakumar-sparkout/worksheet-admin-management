'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Phone, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { tree } from 'next/dist/build/templates/app-page';
import { format } from 'path';
import { LoaderIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const RegisterPage = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
     mobile:'',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
 const [emailErr,setEmailErr]=useState<boolean>(false)
 const [mobileErr,setMobileErr] = useState<boolean>(false)
 const [passwordErr,setPasswordErr]=useState<boolean>(false)
 const [conpassErr,setConPassErr]= useState<boolean>(false)
 const [confirm,setConfirm] = useState<boolean>(true)
 
 //route

const router = useRouter();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({ ...prev, [name]: value }));


    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

   

    if (name === "email") {
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const correct = valid.test(value);
    setEmailErr(!correct);
  }

  if(name==='mobile'){
    if (value.length === 10 && /^\d{10}$/.test(value)){
      setMobileErr(false)
    }else{
        setMobileErr(true)
    }
  }
  if (name === "password") {
    setPasswordErr(value.length < 7);
  }

  if (name === "confirmPassword") {
    setConPassErr(value.length < 7);
     if(formData.password === value){
     setConfirm(true);
    }else{
      setConfirm(false)
    }
  }


    
     

  };




  const handleRegister = async(e:React.FormEvent)=>{
    e.preventDefault()
  setLoading(true);

 
    try{

       //email exists check
      const existsEmail = await fetch(`http://localhost:3004/admin`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const resData = await existsEmail.json();
console.log('resData', resData);

const emailExists = resData.some(
  (item: any) =>
    item.email === formData.email || item.adminEmail === formData.email
);

if (emailExists) {
  console.log('Email already exists:', formData.email);
    toast("Email Already Exists try another email", {
                description: "Welcome Admin!",
                position: "top-right",
                className: "text-green-500 text-sm font-medium ",
              });
  throw new Error('Email Already Exists!');

}

       

          const res =  await fetch('http://localhost:3004admin',{
            method:'POST',
            headers:{
              'Content-type':'application/json'
            },
            body: JSON.stringify({name:formData.name,email:formData.email , password:formData.password,confirmPassword:formData.confirmPassword,mobile:formData.mobile})
          })

          const data = await res.json()
           setTimeout(()=>{
          if(res.ok){
              console.log('data response',data)
             
              toast("Admin Register Successfully", {
                description: "Welcome Admin!",
                position: "top-right",
                className: "text-green-500 text-sm font-medium ",
              });
           router.push('/admin/auth/login')
           setLoading(false)
         
          }
           },3000)
         
    }catch(error:any){
      setTimeout(()=>{
          toast("Your Register is Invalid Please try Again", {
            description: "try again",
            position: "top-right",
            className: "text-green-500 text-sm font-medium ",
          });
          console.log('error message',error.message)
      },3000)
      setLoading(false)
    }
  }

  //onkeyDown

   const preventInvalidChars = async(e:any)=> {
    const invalidChars = ["e", "E", "+", "-"];
    if (invalidChars.includes(e.key)) {
      e.preventDefault();
      return false;
    }
    return true;
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
          <h1 className="text-3xl font-bold tracking-tight">Create Admin account</h1>
          <p className="text-muted-foreground">
            Join us and start your journey today
          </p>
        </div>

        {/* Register Card */}
        <Card>
          
          <CardContent className="space-y-4">
           

            {/* Register Form */}
            <form  className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`pl-10`}
                    required
                  />
                </div>
                
              </div>

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
                    className={`pl-10 ${emailErr ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {emailErr===true &&(
                            <span className="text-sm text-red-500">
                                Enter the Valid Email Id
                            </span>
                                )
                                }
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phonenumber"
                    name="mobile"
                    type="number"
                     onKeyDown={(e)=>preventInvalidChars(e)}
                    placeholder="Enter your Personal Mobile Number "
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className={`pl-10 ${mobileErr ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
                {mobileErr===true &&(
                            <span className="text-sm text-red-500">
                                Enter the Valid Mobile Number
                            </span>
                                )
                                }
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor='address'>Address</Label>
                <div className="relative">
                   <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Enter your Your Address Details"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`no-spinner pl-10`}
                    required
                  />
                </div>
                
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${passwordErr ? 'border-red-500' : ''}`}
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
                 {passwordErr && (
                  <p className='text-sm text-red-500'>Enter password MinLength 7</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`pl-10 pr-10 ${conpassErr ? 'border-red-500' : ''}`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                 {conpassErr && (
                  <p className='text-sm text-red-500'>Enter password MinLength 7</p>
                )}

                {!confirm && (
                  <p className='text-sm text-red-500 mt-3'>Confirm both password are same!</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}
              </div>

              {/* <Button type="submit" className="w-full cursor-pointer">
                Create Acccount
              </Button> */}
              {loading===false &&  (
               <Button className="w-full cursor-pointer" onClick={handleRegister} disabled={
                loading  || !formData.confirmPassword || !formData.email || !formData.mobile || !formData.name || !formData.password || passwordErr || conpassErr || emailErr || mobileErr || !agreeToTerms || !confirm }>
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
              )}
              {loading && (
               <Button className='w-full '>
                 
      <Spinner />
    
                </Button>
              )}       
            </form>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link
                href="/admin/auth/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
