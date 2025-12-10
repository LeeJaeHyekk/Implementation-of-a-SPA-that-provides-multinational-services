import DetailPage from '@/pages/DetailPage'

interface TrademarkDetailRouteProps {
  params: {
    id: string
  }
}

export default function TrademarkDetailRoute({ params }: TrademarkDetailRouteProps) {
  return <DetailPage id={params.id} />
}
