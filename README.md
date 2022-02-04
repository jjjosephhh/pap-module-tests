# Auto confirm cognito registration

Set the Pre sign-up trigger to call a Lambda function with this code

```python
def lambda_handler(event, context):
    event['response'] = {
        'autoConfirmUser': True,
        'autoVerifyEmail': False,
        'autoVerifyPhone': False
    }
    return event
```
