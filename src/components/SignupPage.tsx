
'use client'
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [formData, setFormData] = useState({
  
    email: '',
    password: '',
    name:''
  });
  const router = useRouter();

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const result = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (result?.ok) {
        router.push('/dashboard');
      } else {
        console.error("Error during login", result?.error);
      }
    } else {
      console.error("Error creating user");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    
      <input 
        type="name" 
        placeholder="name" 
        value={formData.name} 
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={formData.email} 
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={formData.password} 
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
}
