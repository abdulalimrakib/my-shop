import Container from "@/components/Container";
import { Spinner } from "@/components/ui/spinner";

const Loading = () => (
  <Container className="flex items-center justify-center gap-2 py-32 text-shop_dark_green font-medium">
    <Spinner className="size-6" />
    Loading...
  </Container>
);

export default Loading;
