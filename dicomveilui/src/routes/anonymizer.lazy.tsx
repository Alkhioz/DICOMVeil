import { createLazyFileRoute } from '@tanstack/react-router'
import { AnonymizerPage } from '@pages/anonymizer.page'

export const Route = createLazyFileRoute('/anonymizer')({
  component: AnonymizerPage
})