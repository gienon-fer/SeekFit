import firebase_admin
from firebase_admin import messaging, credentials
from app.config import settings

cred = credentials.Certificate(settings.FCM_CREDENTIALS_PATH)
firebase_admin.initialize_app(cred)

def send_notification(title: str, message: str, user_ids: list):
    # Logic to send notification via FCM
    messages = [
        messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=message,
            ),
            token=user_id,
        )
        for user_id in user_ids
    ]
    
    response = messaging.send_all(messages)
    print('Successfully sent messages:', response)