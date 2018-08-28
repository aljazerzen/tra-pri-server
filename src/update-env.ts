import * as replace from 'replace';

// this is a hack so we don't have to rebuild the docker image if want to change API url
// it goes through files output webapp files and replaces 'VUE_APP_API_URL_VALUE' with actual API url value

export default async function() {
  await replace({
    regex: "VUE_APP_API_URL_VALUE",
    replacement: process.env.API_URL,
    paths: ['./webapp/dist'],
    recursive: true,
    silent: true,
  });
}