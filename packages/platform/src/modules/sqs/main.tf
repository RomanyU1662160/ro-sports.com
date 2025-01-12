// create the main queue
resource "aws_sqs_queue" "main_queue" {
  name = "${var.environment}-${var.name}"

  visibility_timeout_seconds = var.visibility_timeout
  message_retention_seconds  = var.retention_period
  delay_seconds              = var.delay_seconds

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = var.max_receive_count
  })

  tags = {
    Name        = "${var.environment}-${var.name}"
    Environment = var.environment
    project     = "ro-sports-club"
    ManagedBy   = "Terraform"
  }
}

// create dead letter queue
resource "aws_sqs_queue" "dlq" {
  name = "${var.environment}-${var.name}-dlq"
  tags = {
    Name        = "${var.environment}-${var.name}"
    Environment = var.environment
    project     = "ro-sports-club"
    ManagedBy   = "Terraform"
  }
}

// policy to allow the main queue to send messages to the DLQ
resource "aws_sqs_queue_redrive_allow_policy" "dlq_redrive_allow_policy" {
  queue_url = aws_sqs_queue.dlq.id

  redrive_allow_policy = jsonencode({
    redrivePermission = "byQueue",
    sourceQueueArns   = [aws_sqs_queue.main_queue.arn]
  })
}
