import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth-admin';
import { LoginForm } from '@/components/dash/login-form';
export const dynamic='force-dynamic';
export default async function LoginPage({searchParams}:{searchParams:Promise<{error?:string}>}){
 if(await isAuthenticated())redirect('/dash');
 const {error}=await searchParams;
 const message=error==='invalid'?'Senha incorreta. Tente novamente.':error==='limited'?'Muitas tentativas. Aguarde 15 minutos.':error?'Não foi possível entrar. Tente novamente.':undefined;
 return <main className="flex min-h-screen items-center justify-center bg-muted px-4"><LoginForm error={message}/></main>;
}
