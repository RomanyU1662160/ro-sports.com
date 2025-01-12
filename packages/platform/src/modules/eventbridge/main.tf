// EventBridge was formerly known as CloudWatch Events.
//The following code snippet creates an EventBridge rule that triggers a Lambda function when a specific event occurs.

// The EventBridge rule is associated with an EventBridge bus.

# Create an EventBridge event bus
resource "aws_cloudwatch_event_bus" "event_bus" {
  name        = "${var.environment}-${var.bus_name}"
  description = "Event bus for ${var.environment} environment"
  tags = {
    Name        = "${var.environment}-${var.bus_name}"
    Environment = var.environment
    managed_by  = "terraform"
  }
}

# Create an EventBridge rule
resource "aws_cloudwatch_event_rule" "event_rule" {
  name           = "${var.environment}-${var.rule_name}"
  event_bus_name = aws_cloudwatch_event_bus.event_bus.name
  event_pattern  = var.event_pattern

  tags = {
    Name        = "${var.environment}-${var.rule_name}"
    Environment = var.environment
    managed_by  = "terraform"
  }
}

resource "aws_cloudwatch_event_target" "event_target" {
  rule           = aws_cloudwatch_event_rule.event_rule.name
  event_bus_name = aws_cloudwatch_event_bus.event_bus.name
  target_id      = "${var.environment}-${var.target_id}"
  arn            = var.target_arn

}
