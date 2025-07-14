// utils/saveAndOpenFile.ts    (← renamed)
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import * as Mime from "react-native-mime-types";

export const saveAndOpenFile = async (
  obj: { name: string; data: string; mimetype?: string },
  openImmediately = true
) => {
  const target =
    FileSystem.documentDirectory +
    (obj.name || `file.${Mime.extension(obj.mimetype) || "dat"}`);

  await FileSystem.writeAsStringAsync(target, obj.data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (!openImmediately) return target;

  // iOS & most Android devices have the Expo sharing sheet
  if (Sharing.isAvailableAsync && (await Sharing.isAvailableAsync())) {
    await Sharing.shareAsync(target);
  } else {
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: `file://${target}`,
      flags: 1,
      type: obj.mimetype || "application/octet-stream",
    });
  }

  return target;
};

// // utils/downloadLicense.ts
// import * as FileSystem from "expo-file-system";
// import * as Sharing from "expo-sharing";
// import * as IntentLauncher from "expo-intent-launcher";
// import * as Mime from "react-native-mime-types"; // yarn add react-native-mime-types

// /**
//  * Take the driver_license object you showed and save+open it.
//  * @param dl { name: string, data: string, mimetype: string }
//  */
// export const saveAndOpenLicense = async (
//   dl: { name: string; data: string; mimetype?: string },
//   openImmediately = true
// ) => {
//   try {
//     /* 1️⃣ pick a location */
//     const fileUri =
//       FileSystem.documentDirectory +
//       (dl.name || `license.${Mime.extension(dl.mimetype) || "pdf"}`);

//     /* 2️⃣ write Base-64 → binary file */
//     await FileSystem.writeAsStringAsync(fileUri, dl.data, {
//       encoding: FileSystem.EncodingType.Base64,
//     });

//     /* 3️⃣ open or share */
//     if (!openImmediately) return fileUri; // caller will handle

//     if (Sharing.isAvailableAsync && (await Sharing.isAvailableAsync())) {
//       await Sharing.shareAsync(fileUri);
//     } else {
//       // fallback: fire an "open with…" intent (Android only)
//       await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
//         data: `file://${fileUri}`,
//         flags: 1,
//         type: dl.mimetype || "application/pdf",
//       });
//     }

//     return fileUri;
//   } catch (err) {
//     console.error("License download error", err);
//     throw err;
//   }
// };
