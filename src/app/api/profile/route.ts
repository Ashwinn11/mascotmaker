import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserCredits, getTransactions } from "@/lib/db";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const credits = await getUserCredits(session.user.id);
    const transactions = await getTransactions(session.user.id);

    return NextResponse.json({ credits, transactions });
}
