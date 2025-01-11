
output "queue_arn" {
  description = "ARN of the main queue"
  value       = aws_sqs_queue.main_queue.arn
}

output "queue_url" {
  description = "URL of the main queue"
  value       = aws_sqs_queue.main_queue.url
}

output "dlq_arn" {
  description = "ARN of the dead letter queue"
  value       = aws_sqs_queue.dlq.arn
}

output "dlq_url" {
  description = "URL of the dead letter queue"
  value       = aws_sqs_queue.dlq.url
}
