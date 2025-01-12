resource "aws_lambda_function" "lambda_function" {
  role             = var.role_arn
  function_name    = var.function_name
  filename         = var.filename
  handler          = var.handler
  runtime          = var.runtime
  timeout          = var.timeout
  memory_size      = var.memory_size
  source_code_hash = filebase64sha256(var.filename)
  environment {
    variables = var.environment_variables
  }
  tags = {
    Environment = var.environment
    Name        = "${var.function_name}-${var.environment}"
    managed_by  = "Terraform"
  }
}

# Create a CloudWatch log group for the Lambda function
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/${aws_lambda_function.lambda_function.function_name}-${var.environment}"
  retention_in_days = var.log_retention
}
