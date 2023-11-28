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

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // coerce : 강요하다 구속하다 지배하다 위압하다
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
  // console.log('*=======> createInvoice called!');
  // console.log('*=======> formData :', formData);
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  })
  // console.log('*=======> customerId :', customerId);
  // console.log('*=======> amount :', amount);
  // console.log('*=======> status :', status);

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

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });

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
  throw new Error('[TEST] Failed to Delete Invoice');

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');

    return { message: 'Deleted Invoice.' };
  } catch ( error ) {
    return { message: 'Database Error: Failed to Delete Invoice.'};
  }
}