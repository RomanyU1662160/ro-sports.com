// create a role for lambda to allow it to write logs to cloudwatch
resource "aws_iam_role" "lambda_iam_role" {
  name = "${var.environment}-${var.role_name}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = "sts:AssumeRole",
        Principal = {
          Service = "lambda.amazonaws.com",
        },
        tags = {
          Name        = "${var.environment}-${var.role_name}"
          Environment = var.environment
          managed_by  = "terraform"
        },
      },
    ],

  })
}

// attach the required policies to the role to give lambda the required permissions // logs , eventbridge and secrets manager

resource "aws_iam_role_policy_attachment" "lambda_policy_execution" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_eventbridge_execution" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEventBridgeFullAccess"
}

resource "aws_iam_role_policy_attachment" "lambda_cloudwatch_execution" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"
}
resource "aws_iam_role_policy_attachment" "lambda_secretsManagerReadWrite" {
  role       = aws_iam_role.lambda_iam_role.name
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}
