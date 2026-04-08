import {loadAppConfig} from "./config";
import {sendEmail} from "./email";
import {scan} from "./scan";
import {buildEmailFromScanResult} from "./email-template/from-scan-result";
import {buildEmailFromError} from "./email-template/from-error";

const EMAIL_THREAD_ID = 'cineplex-notifier';

const main = async () => {
  const startTime = new Date();
  console.log(`🚀 [${startTime.toLocaleTimeString()}] Cineplex Notifier started`);
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
    await sendEmail(appConfig, '🎬 Cineplex Notifier - Updates', emailBody, EMAIL_THREAD_ID);
  } catch (error: unknown) {
    const emailBody = buildEmailFromError(error);
    console.log('❌ Error', error);
    await sendEmail(appConfig, '❌ Cineplex Notifier - Error', emailBody);
  } finally {
    const endTime = new Date();
    const durationMs = endTime.getTime() - startTime.getTime();

    console.log(
      `🏁 [${endTime.toLocaleTimeString()}] Cineplex Notifier finished (${durationMs} ms)`
    );
  }
}

main().catch(console.error);
