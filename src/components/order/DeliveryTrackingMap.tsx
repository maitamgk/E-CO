import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OrderStatus, StatusHistoryEntry } from '@/types';
import { Truck, MapPin, Building2, CheckCircle2, Clock, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface DeliveryTrackingMapProps {
  status: OrderStatus;
  statusHistory?: StatusHistoryEntry[];
  customerAddress: string;
  customerName: string;
  orderCode: string;
}

// B-ECO Warehouse in Tuy Hòa, Phú Yên
const WAREHOUSE_COORDS: [number, number] = [13.0882, 109.3299]; // Phú Yên

// Simple deterministic hash to generate slight variations for customer coordinates based on address text
const getDestinationCoords = (address: string): [number, number] => {
  const lower = address.toLowerCase();
  
  // Known major regions mapping for realistic map locations
  if (lower.includes('hồ chí minh') || lower.includes('hcm') || lower.includes('sài gòn') || lower.includes('tphcm')) {
    return [10.7769, 106.7009];
  }
  if (lower.includes('hà nội') || lower.includes('hn')) {
    return [21.0285, 105.8542];
  }
  if (lower.includes('đà nẵng')) {
    return [16.0544, 108.2022];
  }
  if (lower.includes('nha trang') || lower.includes('khánh hòa')) {
    return [12.2388, 109.1967];
  }
  if (lower.includes('quy nhơn') || lower.includes('bình định')) {
    return [13.7820, 109.2194];
  }
  if (lower.includes('đà lạt') || lower.includes('lâm đồng')) {
    return [11.9404, 108.4583];
  }
  if (lower.includes('cần thơ')) {
    return [10.0452, 105.7469];
  }

  // Fallback: Generate offset relative to Phú Yên (within Vietnam boundaries)
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = (hash << 5) - hash + address.charCodeAt(i);
    hash |= 0;
  }
  const latOffset = ((Math.abs(hash) % 200) - 100) / 50; // -2 to +2 deg
  const lngOffset = ((Math.abs(hash * 3) % 150) - 75) / 50; // -1.5 to +1.5 deg
  
  return [13.0882 + latOffset, 109.3299 + lngOffset];
};

// Helper component to fit bounds automatically
const AutoFitBounds = ({ coords }: { coords: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [map, coords]);
  return null;
};

// Custom DivIcons for Leaflet
const createCustomIcon = (html: string, className = '') => {
  return L.divIcon({
    html,
    className: `custom-leaflet-marker ${className}`,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -40],
  });
};

const warehouseIconHtml = `
  <div style="
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #166534, #15803d);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 6px 16px rgba(22,101,52,0.4);
    border: 3px solid white;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 22 14-8V2l-14 8z"/><path d="M6 10v12"/><path d="M13 14v8"/><path d="M2 22h20"/></svg>
  </div>
`;

const customerIconHtml = `
  <div style="
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #0f766e, #0d9488);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 6px 16px rgba(15,118,110,0.4);
    border: 3px solid white;
  ">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>
`;

const truckIconHtml = `
  <div style="
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 0 0 8px rgba(37,99,235,0.2), 0 8px 20px rgba(37,99,235,0.4);
    border: 3px solid white;
    animation: pulse 2s infinite;
  ">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14v10Z"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="17.5" r="2.5"/></svg>
  </div>
`;

export const DeliveryTrackingMap = ({
  status,
  statusHistory = [],
  customerAddress,
  customerName,
  orderCode,
}: DeliveryTrackingMapProps) => {
  const destCoords = useMemo(() => getDestinationCoords(customerAddress), [customerAddress]);

  // Calculate truck progress position (0 = warehouse, 0.55 = in transit, 1 = customer)
  const truckProgress = useMemo(() => {
    if (status === 'delivered') return 1.0;
    if (status === 'shipped') return 0.55;
    if (status === 'confirmed') return 0.15;
    return 0; // pending or cancelled
  }, [status]);

  const truckCoords: [number, number] = useMemo(() => {
    const lat = WAREHOUSE_COORDS[0] + (destCoords[0] - WAREHOUSE_COORDS[0]) * truckProgress;
    const lng = WAREHOUSE_COORDS[1] + (destCoords[1] - WAREHOUSE_COORDS[1]) * truckProgress;
    return [lat, lng];
  }, [destCoords, truckProgress]);

  const routePath = [WAREHOUSE_COORDS, destCoords];

  const warehouseIcon = useMemo(() => createCustomIcon(warehouseIconHtml), []);
  const customerIcon = useMemo(() => createCustomIcon(customerIconHtml), []);
  const truckIcon = useMemo(() => createCustomIcon(truckIconHtml), []);

  const currentStatusText = useMemo(() => {
    switch (status) {
      case 'pending':
        return 'Đang tiếp nhận đơn hàng tại Kho B-ECO';
      case 'confirmed':
        return 'Đang đóng gói sản phẩm tại Kho B-ECO Phú Yên';
      case 'shipped':
        return 'Đang vận chuyển trên đường giao tới bạn';
      case 'delivered':
        return 'Đã giao hàng thành công!';
      case 'cancelled':
        return 'Đơn hàng đã được hủy';
      default:
        return 'Đang cập nhật vị trí...';
    }
  }, [status]);

  return (
    <div className="space-y-4">
      {/* Realtime Status Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-green-800 to-emerald-900 text-white rounded-2xl p-4 md:p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-emerald-300 flex-shrink-0">
            {status === 'shipped' ? (
              <Truck className="w-6 h-6 animate-bounce" />
            ) : status === 'delivered' ? (
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            ) : (
              <Navigation className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Lộ trình vận chuyển realtime</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h4 className="text-base md:text-lg font-bold text-white mt-0.5">{currentStatusText}</h4>
            <p className="text-xs text-white/70 mt-0.5">
              Từ Kho B-ECO (Phú Yên) ➔ {customerAddress || 'Địa chỉ khách hàng'}
            </p>
          </div>
        </div>

        {statusHistory.length > 0 && (
          <div className="text-left md:text-right border-t md:border-t-0 md:border-l border-white/15 pt-3 md:pt-0 md:pl-5 flex-shrink-0">
            <span className="text-[11px] text-white/60 block">Cập nhật mới nhất</span>
            <span className="text-xs font-semibold text-emerald-200">
              {format(new Date(statusHistory[statusHistory.length - 1].timestamp), 'HH:mm - dd/MM/yyyy', { locale: vi })}
            </span>
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="relative h-[340px] md:h-[420px] rounded-2xl overflow-hidden border border-border/60 shadow-md">
        <MapContainer
          center={WAREHOUSE_COORDS}
          zoom={7}
          scrollWheelZoom={false}
          className="h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <AutoFitBounds coords={[WAREHOUSE_COORDS, destCoords]} />

          {/* Polyline Route */}
          <Polyline
            positions={routePath}
            pathOptions={{
              color: '#166534',
              weight: 4,
              dashArray: status === 'shipped' ? '8, 8' : undefined,
              opacity: 0.8,
            }}
          />

          {/* Warehouse Marker */}
          <Marker position={WAREHOUSE_COORDS} icon={warehouseIcon}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-sm text-green-800 flex items-center gap-1">
                  <Building2 className="w-4 h-4 text-green-700 inline" /> Kho B-ECO Phú Yên
                </p>
                <p className="text-xs text-slate-600 mt-1">Xuất phát: TP. Tuy Hòa, Phú Yên</p>
              </div>
            </Popup>
          </Marker>

          {/* Customer Destination Marker */}
          <Marker position={destCoords} icon={customerIcon}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-sm text-teal-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-teal-700 inline" /> {customerName}
                </p>
                <p className="text-xs text-slate-600 mt-1">{customerAddress}</p>
              </div>
            </Popup>
          </Marker>

          {/* Shipping Truck Marker */}
          {status !== 'cancelled' && (
            <Marker position={truckCoords} icon={truckIcon}>
              <Popup>
                <div className="p-1 text-center">
                  <p className="font-bold text-sm text-blue-700">🚚 Xe vận chuyển B-ECO</p>
                  <p className="text-xs text-slate-600 mt-1">Đơn hàng: {orderCode}</p>
                  <span className="inline-block bg-blue-100 text-blue-800 text-[11px] px-2 py-0.5 rounded-full font-semibold mt-1">
                    {currentStatusText}
                  </span>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};
