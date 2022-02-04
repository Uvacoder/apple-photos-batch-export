
const BATCH_SIZE = 50;
const BASE_NAME = 'Liz-iCloud-';
const DESTINATION = Path('/Users/joeattardi/Desktop/export-test');

const Photos = Application('Photos');
const Finder = Application('Finder');
const System = Application('System Events');

const photos = Photos.mediaItems();

console.log(`Exporting ${photos.length} items in batches of ${BATCH_SIZE}`);

let sequence = 0;
let batch = 0;
let start = 0;
let end = BATCH_SIZE;

const exportLocation = System.folders.byName(DESTINATION.toString());

while (start < photos.length) {
  console.log();
  console.log(`Starting batch ${++batch} (items ${start}-${end})`);

  Photos.export(photos.slice(start, end), {
    to: DESTINATION
  });

  start = end;
  end += BATCH_SIZE;

  const files = exportLocation.files.name().filter(name => name !== '.DS_Store' && !name.startsWith(BASE_NAME));
  files.forEach(file => {
    const extension = file.split('.').pop();
    const targetName = `${BASE_NAME}${++sequence}.${extension}`;
    exportLocation.files.byName(file).name = targetName;

    console.log(`  exported ${file} ==> ${targetName}`);
  });

  const allFiles = exportLocation.files.name().filter(name => name !== '.DS_Store');
  const percentDone = Math.round((allFiles.length / photos.length) * 100);
  console.log(`Batch complete, ${allFiles.length} files exported so far (${percentDone}%)`);
}

console.log();
console.log('done!');
