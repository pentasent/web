import CertificatesPage from '../certificates/page';

interface PageProps {
  searchParams?: Promise<{ id?: string; certificate_id?: string }> | { id?: string; certificate_id?: string };
}

export default async function CertificationsPage(props: PageProps) {
  return <CertificatesPage {...props} />;
}
