import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
} from "@azure/storage-blob";

export const CONTAINER_USER_INPUT = "userinput";
export const CONTAINER_PREDICTION = "predictions";
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME as string;
const accountKey = process.env.AZURE_STORAGE_ACCESS_KEY as string;
const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString);

export const fileContainerClient =
  blobServiceClient.getContainerClient(CONTAINER_PREDICTION);

const sharedKeyCredential = new StorageSharedKeyCredential(
  accountName,
  accountKey,
);

export function generateBlobSASParameters(
  containerName: string,
  blobName: string,
  permissions: string,
  expireMinutes = 30, // 30 minutes
  contentType?: string,
): string {
  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName: blobName,
      permissions: BlobSASPermissions.parse(permissions),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + expireMinutes * 60 * 1000),
      protocol: SASProtocol.Https,
      contentType,
    },
    sharedKeyCredential,
  ).toString();
  return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}

export async function uploadFileToAzureCloud(
  blobPath: string,
  data: Buffer | Blob | ArrayBuffer | ArrayBufferView,
  expireInDays: number = 180,
): Promise<string> {
  await fileContainerClient.getBlockBlobClient(blobPath).uploadData(data);

  const url = generateBlobSASParameters(
    CONTAINER_PREDICTION,
    blobPath,
    "r",
    expireInDays * 24 * 60,
  );

  return url;
}

export const saveFileToAzureCloud = async (
  blobPath: string,
  data: any,
  expireInDays: number = 180,
): Promise<string> => {
  await fileContainerClient.getBlockBlobClient(blobPath).uploadData(data);

  const url = generateBlobSASParameters(
    CONTAINER_PREDICTION,
    blobPath,
    "r",
    expireInDays * 24 * 60,
  );

  return url;
};

export const saveUriFileToAzure = async (url: string, blobName: string) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.log(
        "saveUriFileToAzure fetch",
        response.status,
        response.statusText,
      );
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const fileBuffer = await response.arrayBuffer();
    const xblobName = `x-model/${blobName}`;
    console.log("saveUriFileToAzure", xblobName);

    await fileContainerClient
      .getBlockBlobClient(xblobName)
      .uploadData(fileBuffer);

    const sasUrl = generateBlobSASParameters(
      CONTAINER_PREDICTION,
      xblobName,
      "r",
      30 * 24 * 60,
    );
    console.log("sasUrl", sasUrl);

    return sasUrl;
  } catch (error) {
    console.error("saveUriFileToAzure", error);
  }
};

export const uploadFilesToAzure = async (fileUrls: any, userId: string) => {
  try {
    // Ensure imageUrls is an array
    const urlsArray = Array.isArray(fileUrls) ? fileUrls : [fileUrls];

    // Map the urls to upload promises
    const uploadPromises = urlsArray.map((url) => {
      // Get the file extension
      const extension = url.split(".").pop();
      const blobName = `${userId}-${Date.now()}.${extension}`;
      return saveUriFileToAzure(url, blobName);
    });

    // Use Promise.all to wait for all upload operations to finish
    const sasUrls = await Promise.all(uploadPromises);

    // Filter out any null values in case of failed uploads
    const urls = sasUrls.map((sasUrl) => {
      if (sasUrl) {
        return sasUrl;
      }
      return null;
    });

    return sasUrls.filter((item): item is string => item !== undefined);
  } catch (error) {
    console.error("uploadFilesToAzure", error);
    return []; // Return an empty array or some error indication
  }
};
