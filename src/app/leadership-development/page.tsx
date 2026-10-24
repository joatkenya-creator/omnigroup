import { ServicePage, serviceMetadata } from "@/components/ServicePage";
import { services } from "@/content/services";

const service = services["leadership-development"];

export const metadata = serviceMetadata(service);

export default function Page() {
  return <ServicePage service={service} />;
}
