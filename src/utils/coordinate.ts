/**
 * 度分秒（DMS）形式への変換
 */
export function convertToDMS(decimal: number, isLatitude: boolean): string {
  const absolute = Math.abs(decimal)
  const degrees = Math.floor(absolute)
  const minutesDecimal = (absolute - degrees) * 60
  const minutes = Math.floor(minutesDecimal)
  const seconds = ((minutesDecimal - minutes) * 60).toFixed(2)

  let direction: string
  if (isLatitude) {
    direction = decimal >= 0 ? 'N' : 'S'
  } else {
    direction = decimal >= 0 ? 'E' : 'W'
  }

  return `${degrees}°${minutes}'${seconds}" ${direction}`
}

/**
 * Maidenhead Grid Locator (グリッドロケーター) の計算
 */
export function calculateGridLocator(lat: number, lon: number): string {
  // 経度を0-360の範囲に変換
  let adjustedLon = lon + 180
  // 緯度を0-180の範囲に変換
  let adjustedLat = lat + 90

  // Field (A-R)
  const fieldLon = String.fromCharCode(65 + Math.floor(adjustedLon / 20))
  const fieldLat = String.fromCharCode(65 + Math.floor(adjustedLat / 10))

  // Square (0-9)
  adjustedLon = adjustedLon % 20
  adjustedLat = adjustedLat % 10
  const squareLon = Math.floor(adjustedLon / 2)
  const squareLat = Math.floor(adjustedLat / 1)

  // Subsquare (a-x)
  adjustedLon = (adjustedLon % 2) * 60
  adjustedLat = (adjustedLat % 1) * 60
  const subsquareLon = String.fromCharCode(97 + Math.floor(adjustedLon / 5))
  const subsquareLat = String.fromCharCode(97 + Math.floor(adjustedLat / 2.5))

  return `${fieldLon}${fieldLat}${squareLon}${squareLat}${subsquareLon}${subsquareLat}`
}

/**
 * ハバーサイン公式による2点間の距離計算（メートル）
 * 地球を球体として扱い、より正確な距離を計算
 *
 * @param lat1 地点1の緯度
 * @param lon1 地点1の経度
 * @param lat2 地点2の緯度
 * @param lon2 地点2の経度
 * @returns 距離（メートル）
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // 地球の半径（メートル）
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // メートル単位
}

/**
 * 2点間の方位を計算する
 * @param lat1 地点1の緯度
 * @param lon1 地点1の経度
 * @param lat2 地点2の緯度
 * @param lon2 地点2の経度
 * @returns 方位（0-360度）
 */
export function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const λ1 = (lon1 * Math.PI) / 180;
  const λ2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360; // 度数法に変換し、0-360の範囲に正規化

  return brng;
}


/**
 * 方位（度）を8方位の文字列に変換する
 * @param bearing 方位（0-360度）
 * @returns 8方位の文字列 (N, NE, E, SE, S, SW, W, NW)
 */
export function bearingToCardinal(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * 都道府県名から日本のコールエリア（JA1-JA0）を取得する
 * @param prefecture 都道府県名
 * @returns コールエリア番号 (1-8, 0) または null
 */
export function getCallArea(prefecture: string): number | null {
  // エリア1: 関東（JA1）
  const area1 = ['東京都', '神奈川県', '千葉県', '埼玉県', '茨城県', '栃木県', '群馬県', '山梨県', '長野県', '新潟県'];

  // エリア2: 東海（JA2）
  const area2 = ['愛知県', '静岡県', '岐阜県', '三重県'];

  // エリア3: 近畿（JA3）
  const area3 = ['大阪府', '京都府', '兵庫県', '奈良県', '和歌山県', '滋賀県'];

  // エリア4: 中国（JA4）
  const area4 = ['広島県', '岡山県', '島根県', '鳥取県', '山口県'];

  // エリア5: 四国（JA5）
  const area5 = ['香川県', '徳島県', '愛媛県', '高知県'];

  // エリア6: 九州（JA6）- 沖縄を除く
  const area6 = ['福岡県', '佐賀県', '長崎県', '大分県', '熊本県', '宮崎県', '鹿児島県'];

  // エリア7: 東北（JA7）
  const area7 = ['宮城県', '福島県', '岩手県', '青森県', '秋田県', '山形県'];

  // エリア8: 北海道（JA8）
  const area8 = ['北海道'];

  // エリア0: 沖縄（JA0）
  const area0 = ['沖縄県'];

  if (area1.includes(prefecture)) return 1;
  if (area2.includes(prefecture)) return 2;
  if (area3.includes(prefecture)) return 3;
  if (area4.includes(prefecture)) return 4;
  if (area5.includes(prefecture)) return 5;
  if (area6.includes(prefecture)) return 6;
  if (area7.includes(prefecture)) return 7;
  if (area8.includes(prefecture)) return 8;
  if (area0.includes(prefecture)) return 0;

  return null;
}
