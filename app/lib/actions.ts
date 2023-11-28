'use server';
/**
 * 'use server'를 추가하면 이 파일 내에서 내보낸(exported) 모든 함수를 server functions로 표시(mark)
 * 이러한 server functions들은 Client | Server Components에서 import해서 유연하게 사용할 수 있다.
 * 또한 "use server"를 액션 내에 추가하여 서버 컴포넌트 내에서 직접적으로 Server Actions를 작성할 수도 있다.
 */

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: '고객을 선택해 주세요.'
  }),
  amount: z.coerce.number().gt(0, { message: '$0 보다 큰 금액을 입력해 주세요.' }), // coerce : 강요하다 구속하다 지배하다 위압하다
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: '송장 상태를 선택해 주세요.',
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
}

export async function createInvoice(prevState: State, formData: FormData) {
  // console.log('*=======> createInvoice called!');
  // console.log('*=======> formData :', formData);

  // safeParse() will return an object containing either a success or error field. This will help handle validation more gracefully without having put this logic inside the try/catch block.
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  // console.log('*=======> customerId :', customerId);
  // console.log('*=======> amount :', amount);
  // console.log('*=======> status :', status);

  if ( !validatedFields.success ) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    }
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split('T')[0];
  // console.log('*=======> date :', date);

  try {
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
  } catch ( error ) {
    return { message: 'Database Error: Failed to Create Invoice.'}
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
  const validatedFields = UpdateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

  if ( !validatedFields.success ) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.',
    }
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
  } catch ( error ) {
    return { message: 'Database Error: Failed to Update Invoice.'};
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');

    return { message: 'Deleted Invoice.' };
  } catch ( error ) {
    return { message: 'Database Error: Failed to Delete Invoice.'};
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', Object.fromEntries(formData));
  } catch ( error ) {
    if ( (error as Error).message.includes('CredentialsSignin') ) {
      return 'CredentialsSignin';
    }
    throw error;
  }
}