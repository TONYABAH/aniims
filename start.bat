REM firebase projects:list
REM firebase use aniims

REM gcloud projects list
REM gcloud config set project aniims

REM gcloud firestore export gs://aniims.appspot.com/backup

cd functions
:: gsutil -m cp -r gs://aniims.appspot.com/backup .
firebase emulators:start --import ./backup
