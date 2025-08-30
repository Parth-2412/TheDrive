
#!/bin/bash

# Wait for MinIO to be fully up and running
until curl -s http://localhost:9000/minio/health/ready; do
  echo "Waiting for MinIO to start..."
  sleep 2
done

# Set up MinIO client (mc) configuration
mc alias set myminio http://minio:9000 $MINIO_ROOT_USER $MINIO_ROOT_PASSWORD

# Create a full access policy
cat <<EOF > /tmp/full-access-policy.json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:*",
      "Resource": "arn:aws:s3:::*"
    }
  ]
}
EOF

# Create the policy
mc admin policy create myminio full-access-policy /tmp/full-access-policy.json

# Assign the policy to the user (if using the root user)
mc admin policy set myminio full-access-policy user=$MINIO_ROOT_USER

# Optionally, create a bucket if it doesn't exist
mc mb myminio/$MINIO_BUCKET_NAME

# You can add more setup or customization here, like creating more buckets or users.
