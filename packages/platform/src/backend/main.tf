resource "aws_s3_bucket" "remote_state" {
  bucket = var.s3_bucket_name
  tags = {
    Environment = var.environment
    project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

resource "aws_dynamodb_table" "terraform_locks" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Environment = var.environment
    project     = var.project_name
    ManagedBy   = "Terraform"
  }

}


