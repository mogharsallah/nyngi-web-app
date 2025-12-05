import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  
  return redirect('/auth/login')
}
