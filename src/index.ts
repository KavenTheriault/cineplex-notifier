import {loadAppConfig} from "./config";
import {sendEmail} from "./email";
import {scan} from "./scan";
import {buildEmailFromScanResult} from "./email-template/from-scan-result";
import {buildEmailFromError} from "./email-template/from-error";

const main = async () => {
  const appConfig = loadAppConfig();

  try {
    const scanResult = await scan(appConfig);

    if (
      scanResult.newMovies.length === 0
      && scanResult.newBookableMovies.length === 0
      && scanResult.trackedMovieDatesFound.length === 0
    ) {
      console.log('✅ No new updates to report');
      return;
    }

    const emailBody = buildEmailFromScanResult(scanResult);
    console.log('📧 Sending notification email...');
    await sendEmail('🎬 Cineplex Notifier - Updates', emailBody, appConfig);
  } catch (error: unknown) {
    const emailBody = buildEmailFromError(error);
    console.log('❌ Error', error);
    console.log('❌ Sending error email...');
    await sendEmail('❌ Cineplex Notifier - Error', emailBody, appConfig);
  }
}

main().catch(console.error);
