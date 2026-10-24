import { ServicePage, serviceMetadata } from "@/components/ServicePage";
import { services } from "@/content/services";

const service = services["virtual-assistant-services"];

export const metadata = serviceMetadata(service);

export default function Page() {
  return <ServicePage service={service} />;
}
