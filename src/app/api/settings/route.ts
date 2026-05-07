import { NextResponse } from 'next/server';
import { getSettings }  from '@/lib/db';

const KEYS = [
  'company_name','phone1','phone2','email','whatsapp',
  'address','divisions_heading','divisions_subheading',
  'petroleum_note','facebook','instagram','twitter','linkedin',
];

export async function GET() {
  try {
    const settings = await getSettings(KEYS);
    return NextResponse.json({ settings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ settings: {} });
  }
}
