import { handleSubmission } from "@/lib/server/submit";

export async function POST(request: Request, ctx: RouteContext<"/api/forms/[form]">) {
  const { form } = await ctx.params;
  return handleSubmission(request, form);
}
