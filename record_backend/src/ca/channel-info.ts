import organizations from 'config/organizations.json';
import fs from 'fs';
import path from 'path';

let map: Record<string, any> = {};

for (const [name, info] of Object.entries(organizations)) {
    const channelInfo = fs.readFileSync(path.join(process.cwd(), info.path));
    map[name] = JSON.parse(channelInfo.toString());
}

export const channels = map;