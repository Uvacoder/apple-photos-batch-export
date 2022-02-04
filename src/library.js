import { run } from '@jxa/run';

export function getPhotoCount() {
  return run(() => {
    const Photos = Application('Photos');
    return Photos.mediaItems().length;
  });
}

export function getItems(start, end) {
  return run((start, end) => {
    const Photos = Application('Photos');
    return Photos.mediaItems().slice(start, end);
  }, start, end);
}

export function doExport(start, end, outputDir) {
  return run((start, end, outputDir) => {
    const Photos = Application('Photos');
    Photos.export(Photos.mediaItems().slice(start, end), {
        to: Path(outputDir)
    });
  }, start, end, outputDir);
}
