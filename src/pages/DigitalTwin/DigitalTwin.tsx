/* ═══════════════════════════════════════════════════════════
   AtlasOS — Digital Twin Page
   ═══════════════════════════════════════════════════════════ */

import { useState, useRef, useEffect, type MouseEvent, type WheelEvent } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Layers,
  Flame,
  Activity,
  Info,
} from 'lucide-react';
import {
  Card,
  StatusBadge,
  Button,
  AnimatedNumber,
} from '../../components/shared';
import StadiumLegend from '../../components/digital-twin/StadiumLegend/StadiumLegend';
import StadiumTooltip from '../../components/digital-twin/StadiumTooltip/StadiumTooltip';
import FutureProjection from '../../components/digital-twin/FutureProjection/FutureProjection';
import { useSimulation } from '../../context/SimulationContext';
import {
  digitalTwinZones,
  foodCourts as mockFoodCourts,
  volunteerStations as mockVolunteers,
  emergencyRoutes,
  digitalTwinStats,
} from '../../data/digitalTwinData';
import type {
  DigitalTwinZone,
  FoodCourt,
  VolunteerStation,
  DigitalTwinLayerKey,
  DigitalTwinViewConfig,
} from '../../types';
import styles from './DigitalTwin.module.css';

type InspectorTarget =
  | { kind: 'zone'; data: DigitalTwinZone }
  | { kind: 'food'; data: FoodCourt }
  | { kind: 'volunteer'; data: VolunteerStation }
  | null;

type TooltipTarget =
  | { kind: 'zone'; data: DigitalTwinZone }
  | { kind: 'food'; data: FoodCourt }
  | { kind: 'volunteer'; data: VolunteerStation };

const defaultViewConfig: DigitalTwinViewConfig = {
  zoom: 0.95,
  panX: 0,
  panY: 0,
  rotateX: 55,
  rotateZ: -35,
};

const zoneToRouteMap: Record<string, string> = {
  'dt-north': 'er-1',
  'dt-east': 'er-2',
  'dt-south': 'er-3',
  'dt-west': 'er-4',
  'dt-gate-a': 'er-1',
  'dt-gate-b': 'er-2',
  'dt-gate-c': 'er-3',
  'dt-gate-d': 'er-4',
  'dt-parking-north': 'er-1',
  'dt-parking-south': 'er-3',
  'dt-concourse-1': 'er-1',
  'dt-concourse-2': 'er-3',
};

function DigitalTwin() {
  const { activeScenario, phase } = useSimulation();

  // Viewport 3D State
  const [viewConfig, setViewConfig] = useState<DigitalTwinViewConfig>(defaultViewConfig);
  const [is3D, setIs3D] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const dragMode = useRef<'pan' | 'rotate'>('pan');

  // Layer State
  const [activeLayers, setActiveLayers] = useState<Record<DigitalTwinLayerKey, boolean>>({
    crowdDensity: true,
    gates: true,
    parking: true,
    medical: true,
    foodCourts: true,
    volunteers: true,
    emergencyRoutes: false,
    labels: true,
  });

  // Simulator Data States
  const [zones, setZones] = useState<DigitalTwinZone[]>(digitalTwinZones);
  const [foodCourts, setFoodCourts] = useState<FoodCourt[]>(mockFoodCourts);
  const [volunteers, setVolunteers] = useState<VolunteerStation[]>(mockVolunteers);

  // Evacuation State
  const [evacuatingZones, setEvacuatingZones] = useState<Set<string>>(new Set());
  const [evacuationTimers, setEvacuationTimers] = useState<Record<string, number>>({});
  const [evacuationIntervals, setEvacuationIntervals] = useState<Record<string, number>>({});

  // Crowd Surge Simulation State
  const [isSurging, setIsSurging] = useState(false);

  // Interactive Inspector & Tooltip
  const [selectedItem, setSelectedItem] = useState<InspectorTarget>(null);
  const [hoveredItem, setHoveredItem] = useState<TooltipTarget | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Toggle Layer Helper
  const toggleLayer = (layerKey: DigitalTwinLayerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  };

  // 3D/2D View Toggle
  const toggle3D = () => {
    setIs3D(!is3D);
    if (is3D) {
      // Transition from 3D to 2D
      setViewConfig((prev) => ({
        ...prev,
        rotateX: 0,
        rotateZ: 0,
      }));
    } else {
      // Transition from 2D to 3D
      setViewConfig((prev) => ({
        ...prev,
        rotateX: defaultViewConfig.rotateX,
        rotateZ: defaultViewConfig.rotateZ,
      }));
    }
  };

  // Zoom Helpers
  const handleZoom = (factor: number) => {
    setViewConfig((prev) => ({
      ...prev,
      zoom: Math.max(0.4, Math.min(5, prev.zoom * factor)),
    }));
  };

  const handleResetView = () => {
    setViewConfig(is3D ? defaultViewConfig : { ...defaultViewConfig, rotateX: 0, rotateZ: 0 });
  };

  // Drag-to-pan & Drag-to-rotate Event Handlers
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) {
      e.preventDefault();
    }
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragMode.current = (e.shiftKey || e.button === 2) ? 'rotate' : 'pan';
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    if (dragMode.current === 'rotate' && is3D) {
      setViewConfig((prev) => ({
        ...prev,
        rotateZ: prev.rotateZ + dx * 0.4,
        rotateX: Math.max(0, Math.min(75, prev.rotateX - dy * 0.4)),
      }));
    } else {
      setViewConfig((prev) => ({
        ...prev,
        panX: prev.panX + dx / prev.zoom,
        panY: prev.panY + dy / prev.zoom,
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    const factor = e.deltaY < 0 ? 1.05 : 0.95;
    setViewConfig((prev) => ({
      ...prev,
      zoom: Math.max(0.4, Math.min(5, prev.zoom * factor)),
    }));
  };

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Hover Tooltip Triggers
  const handleZoneHover = (e: MouseEvent, zone: DigitalTwinZone) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setHoveredItem({ kind: 'zone', data: zone });
  };

  const handleFoodHover = (e: MouseEvent, fc: FoodCourt) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setHoveredItem({ kind: 'food', data: fc });
  };

  const handleVolunteerHover = (e: MouseEvent, vs: VolunteerStation) => {
    setTooltipPos({ x: e.clientX, y: e.clientY });
    setHoveredItem({ kind: 'volunteer', data: vs });
  };

  const handleElementLeave = () => {
    setHoveredItem(null);
  };

  // Inspect Sliders State Setters
  const updateZoneOccupancy = (zoneId: string, value: number) => {
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextZ = { ...z, currentOccupancy: value };
          // Keep selected item inspector up to date
          if (selectedItem?.kind === 'zone' && selectedItem.data.id === zoneId) {
            setSelectedItem({ kind: 'zone', data: nextZ });
          }
          return nextZ;
        }
        return z;
      })
    );
  };

  const updateFoodCourtQueue = (fcId: string, value: number) => {
    setFoodCourts((prev) =>
      prev.map((fc) => {
        if (fc.id === fcId) {
          const waitMinutes = Math.round(value * 0.4);
          const nextFc = {
            ...fc,
            queueLength: value,
            waitTime: `${waitMinutes} min`,
            status: value > 35 ? 'critical' : value > 20 ? 'warning' : 'operational' as any
          };
          if (selectedItem?.kind === 'food' && selectedItem.data.id === fcId) {
            setSelectedItem({ kind: 'food', data: nextFc });
          }
          return nextFc;
        }
        return fc;
      })
    );
  };

  const updateVolunteerCount = (vsId: string, value: number) => {
    setVolunteers((prev) =>
      prev.map((vs) => {
        if (vs.id === vsId) {
          const nextVs = {
            ...vs,
            volunteerCount: value,
            status: value === 0 ? 'offline' : value < 3 ? 'warning' : 'operational' as any
          };
          if (selectedItem?.kind === 'volunteer' && selectedItem.data.id === vsId) {
            setSelectedItem({ kind: 'volunteer', data: nextVs });
          }
          return nextVs;
        }
        return vs;
      })
    );
  };

  // Crowd Surge Simulation Loop
  useEffect(() => {
    let intervalId: number;
    // Automatically surge if in crisis or manually triggered
    const shouldSurge = isSurging || phase === 'crisis';

    if (shouldSurge) {
      intervalId = window.setInterval(() => {
        setZones((prevZones) =>
          prevZones.map((z) => {
            // Only surge stands and concourses
            if (z.type === 'stand' || z.type === 'concourse' || z.type === 'vip') {
              const increase = Math.floor(Math.random() * 150) + 50;
              const nextOccupancy = Math.min(z.capacity, z.currentOccupancy + increase);
              return { ...z, currentOccupancy: nextOccupancy };
            }
            return z;
          })
        );
      }, 800);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isSurging, phase]);

  // Sync selected zone in inspector when zones state changes (for simulation loops)
  useEffect(() => {
    if (selectedItem?.kind === 'zone') {
      const currentZone = zones.find((z) => z.id === selectedItem.data.id);
      if (currentZone && currentZone.currentOccupancy !== selectedItem.data.currentOccupancy) {
        setSelectedItem({ kind: 'zone', data: currentZone });
      }
    }
  }, [zones, selectedItem]);

  // Evacuation Timer Tick Loops
  const startEvacuation = (zoneId: string) => {
    if (evacuatingZones.has(zoneId)) return;

    // Toggle emergency layer on automatically for clear visualization
    setActiveLayers((prev) => ({ ...prev, emergencyRoutes: true }));

    // Set zone status to warning/critical
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, status: 'critical' } : z))
    );

    setEvacuatingZones((prev) => {
      const next = new Set(prev);
      next.add(zoneId);
      return next;
    });

    const totalSeconds = 15; // Simulated quick evac countdown
    setEvacuationTimers((prev) => ({ ...prev, [zoneId]: totalSeconds }));

    const zoneObj = zones.find((z) => z.id === zoneId);
    const startOccupancy = zoneObj ? zoneObj.currentOccupancy : 0;
    const stepSize = Math.ceil(startOccupancy / totalSeconds);

    const intId = window.setInterval(() => {
      setEvacuationTimers((prev) => {
        const currentSeconds = prev[zoneId] ?? 0;
        if (currentSeconds <= 1) {
          // Finished Evacuation
          clearInterval(intId);
          setZones((prevZones) =>
            prevZones.map((z) =>
              z.id === zoneId
                ? { ...z, currentOccupancy: 0, status: 'operational' }
                : z
            )
          );
          setEvacuatingZones((prevEvac) => {
            const nextEvac = new Set(prevEvac);
            nextEvac.delete(zoneId);
            return nextEvac;
          });
          const nextTimers = { ...prev };
          delete nextTimers[zoneId];
          return nextTimers;
        }

        // Mid-Evacuation occupancy reduction
        setZones((prevZones) =>
          prevZones.map((z) =>
            z.id === zoneId
              ? {
                ...z,
                currentOccupancy: Math.max(0, z.currentOccupancy - stepSize),
              }
              : z
          )
        );

        return { ...prev, [zoneId]: currentSeconds - 1 };
      });
    }, 1000);

    setEvacuationIntervals((prev) => ({ ...prev, [zoneId]: intId as any }));
  };

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(evacuationIntervals).forEach((id) => clearInterval(id));
    };
  }, [evacuationIntervals]);

  // Reset all simulator data and states
  const handleResetSimulator = () => {
    setIsSurging(false);
    Object.values(evacuationIntervals).forEach((id) => clearInterval(id));
    setEvacuationIntervals({});
    setEvacuationTimers({});
    setEvacuatingZones(new Set());
    setZones(digitalTwinZones);
    setFoodCourts(mockFoodCourts);
    setVolunteers(mockVolunteers);
    setSelectedItem(null);
  };

  // Calculations for live KPIs
  const totalAttendance = zones.reduce((sum, z) => {
    // Only count spectator seating zones towards attendance
    if (z.type === 'stand' || z.type === 'vip') {
      return sum + z.currentOccupancy;
    }
    return sum;
  }, 0);

  const totalSpectatorCapacity = zones.reduce((sum, z) => {
    if (z.type === 'stand' || z.type === 'vip') {
      return sum + z.capacity;
    }
    return sum;
  }, 0);

  const avgDensity = totalSpectatorCapacity > 0 ? totalAttendance / totalSpectatorCapacity : 0;

  const openGates = zones.filter((z) => z.type === 'gate' && z.status === 'operational').length;
  const activeMedicalCases = zones.reduce((sum, z) => {
    if (z.type === 'medical') {
      return sum + z.currentOccupancy;
    }
    return sum;
  }, 0);

  // Density Gradient Color Mapper
  const getDensityColor = (density: number) => {
    if (density < 0.4) {
      const ratio = density / 0.4;
      const h = 152 - ratio * (152 - 38); // Green to Yellow
      return `hsla(${h}, 60%, 48%, 0.65)`;
    } else {
      const ratio = Math.min(1, (density - 0.4) / 0.6);
      const h = 38 - ratio * 38; // Yellow to Red
      return `hsla(${h}, 75%, 55%, 0.65)`;
    }
  };

  const getZoneFill = (zone: DigitalTwinZone) => {
    if (selectedItem?.kind === 'zone' && selectedItem.data.id === zone.id) {
      return 'hsla(215, 100%, 58%, 0.25)';
    }

    if (zone.type === 'field') {
      return 'url(#pitch-pattern)';
    }

    if (activeLayers.crowdDensity && zone.capacity > 0) {
      return getDensityColor(zone.currentOccupancy / zone.capacity);
    }

    // Default Type Palette
    switch (zone.type) {
      case 'stand':
        return 'rgba(215, 100%, 58%, 0.1)';
      case 'vip':
        return 'rgba(38, 92%, 55%, 0.15)';
      case 'concourse':
        return 'rgba(228, 20%, 13%, 0.35)';
      case 'gate':
        return 'rgba(280, 70%, 60%, 0.18)';
      case 'parking':
        return 'rgba(200, 80%, 55%, 0.08)';
      case 'medical':
        return 'rgba(0, 75%, 60%, 0.08)';
      default:
        return 'rgba(255, 255, 255, 0.05)';
    }
  };

  const getZoneStroke = (zone: DigitalTwinZone) => {
    if (selectedItem?.kind === 'zone' && selectedItem.data.id === zone.id) {
      return 'var(--color-accent)';
    }

    if (zone.status === 'critical') {
      return 'var(--color-danger)';
    }
    if (zone.status === 'warning') {
      return 'var(--color-warning)';
    }

    switch (zone.type) {
      case 'field':
        return 'var(--color-success)';
      case 'stand':
        return 'var(--color-accent)';
      case 'vip':
        return 'hsl(38, 92%, 55%)';
      case 'concourse':
        return 'var(--color-border-primary)';
      case 'gate':
        return 'hsl(280, 70%, 60%)';
      case 'parking':
        return 'hsl(200, 80%, 55%)';
      case 'medical':
        return 'hsl(0, 75%, 60%)';
      default:
        return 'var(--color-border-secondary)';
    }
  };

  return (
    <div className={styles.container}>
      {/* ═══ Visualizer Column (Left) ═══ */}
      <div className={styles.visualizerColumn}>
        {/* Layer Filters Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolGroup}>
            <span className={styles.toolbarLabel}>Layers</span>
            <Button
              variant={activeLayers.crowdDensity ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('crowdDensity')}
              leftIcon={<Activity size={14} />}
            >
              Crowd Density
            </Button>
            <Button
              variant={activeLayers.gates ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('gates')}
            >
              Gates
            </Button>
            <Button
              variant={activeLayers.parking ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('parking')}
            >
              Parking
            </Button>
            <Button
              variant={activeLayers.medical ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('medical')}
            >
              Medical
            </Button>
            <Button
              variant={activeLayers.foodCourts ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('foodCourts')}
            >
              Food Courts
            </Button>
            <Button
              variant={activeLayers.volunteers ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('volunteers')}
            >
              Volunteers
            </Button>
            <Button
              variant={activeLayers.emergencyRoutes ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('emergencyRoutes')}
              leftIcon={<Flame size={14} />}
            >
              Evac Routes
            </Button>
          </div>

          <div className={styles.toolGroup}>
            <Button
              variant={activeLayers.labels ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleLayer('labels')}
              leftIcon={<Layers size={14} />}
            >
              Labels
            </Button>
          </div>
        </div>

        {/* Viewport Card */}
        <div
          className={styles.viewportContainer}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={handleContextMenu}
        >
          {/* Deep Ambient Background */}
          <div className={styles.viewportBg} />

          {/* SVG Map Projection */}
          <div
            className={styles.stadiumWrapper}
            style={{
              transform: `rotateX(${viewConfig.rotateX}deg) rotateZ(${viewConfig.rotateZ}deg) translate3d(${viewConfig.panX}px, ${viewConfig.panY}px, 0) scale(${viewConfig.zoom})`,
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.1, 0.8, 0.2, 1)',
            }}
          >
            {/* 3D Ground Plane Grid */}
            <div className={styles.groundPlane} />

            <svg
              viewBox="0 0 1000 1000"
              className={styles.stadiumSvg}
              onClick={() => setSelectedItem(null)}
            >
              <defs>
                <pattern id="pitch-pattern" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="20" height="40" fill="rgba(60, 160, 80, 0.2)" />
                  <rect x="20" width="20" height="40" fill="rgba(50, 140, 70, 0.2)" />
                </pattern>

                <radialGradient id="field-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(60, 160, 80, 0.15)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* Emergency Routes */}
              {(activeLayers.emergencyRoutes || evacuatingZones.size > 0) &&
                emergencyRoutes.map((route) => {
                  const isEvacRouteActive = Array.from(evacuatingZones).some(
                    (zoneId) => zoneToRouteMap[zoneId] === route.id
                  );
                  if (!activeLayers.emergencyRoutes && !isEvacRouteActive) return null;
                  return (
                    <path
                      key={route.id}
                      d={route.pathData}
                      fill="none"
                      stroke={isEvacRouteActive ? 'var(--color-danger)' : 'var(--color-success)'}
                      strokeWidth={isEvacRouteActive ? 6 : 4}
                      className={isEvacRouteActive ? styles.evacRoute : ''}
                      style={{
                        opacity: isEvacRouteActive ? 1 : 0.5,
                        transition: 'stroke-width 0.3s, stroke 0.3s, opacity 0.3s',
                      }}
                    />
                  );
                })}

              {/* Stadium Zones */}
              <g className={styles.projectedLayer}>
                {[...zones]
                  .sort((a, b) => a.layer - b.layer)
                  .map((zone) => {
                    const isLayerHidden =
                      (!activeLayers.gates && zone.type === 'gate') ||
                      (!activeLayers.parking && zone.type === 'parking') ||
                      (!activeLayers.medical && zone.type === 'medical');

                    if (isLayerHidden) return null;

                    const isSelected = selectedItem?.kind === 'zone' && selectedItem.data.id === zone.id;
                    const fill = getZoneFill(zone);
                    const stroke = getZoneStroke(zone);

                    return (
                      <path
                        key={zone.id}
                        d={zone.svgPath}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth={isSelected ? 3.5 : 1.5}
                        className={`${styles.zonePath} ${isSelected ? styles.zoneSelected : ''} ${activeScenario && activeScenario.affectedSystems.includes('Crowd Control') && zone.id.includes('gate') ? styles.emergencyPulse : ''}`}
                        style={{
                          transform: `translateZ(${zone.layer * 30}px)`,
                        }}
                        onMouseMove={(e) => handleZoneHover(e, zone)}
                        onMouseLeave={handleElementLeave}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem({ kind: 'zone', data: zone });
                        }}
                      />
                    );
                  })}
              </g>

              {/* Flashing Alert Indicator Dots at Zone Centers */}
              {zones.map((zone) => {
                const isLayerHidden =
                  (!activeLayers.gates && zone.type === 'gate') ||
                  (!activeLayers.parking && zone.type === 'parking') ||
                  (!activeLayers.medical && zone.type === 'medical');

                if (isLayerHidden || !zone.alerts || zone.alerts === 0) return null;

                return (
                  <g
                    key={`alert-${zone.id}`}
                    transform={`translate(${zone.center.x}, ${zone.center.y}) translateZ(${zone.layer * 30 + 15}px)`}
                    className={styles.zoneAlertIndicator}
                    style={{ pointerEvents: 'none' }}
                  >
                    <circle r={14} fill="var(--color-danger-subtle)" opacity={0.4} />
                    <circle r={8} fill="var(--color-danger)" />
                    <path
                      d="M-3,-1 L3,-1 L0,-6 Z"
                      fill="white"
                      transform="translate(0, 3.5) scale(0.7)"
                    />
                  </g>
                );
              })}

              {/* Food Courts Overlays */}
              {activeLayers.foodCourts &&
                foodCourts.map((fc) => (
                  <g
                    key={fc.id}
                    transform={`translate(${fc.position.x}, ${fc.position.y}) translateZ(120px)`}
                    className={styles.markerGroup}
                    onMouseMove={(e) => handleFoodHover(e, fc)}
                    onMouseLeave={handleElementLeave}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem({ kind: 'food', data: fc });
                    }}
                  >
                    <circle className={styles.markerPulse} r={10} fill="hsl(38, 92%, 55%)" />
                    <circle r={9} fill="hsl(38, 92%, 55%)" className={styles.markerPin} />
                    <text
                      y={3}
                      textAnchor="middle"
                      fontSize={8}
                      fill="var(--color-bg-root)"
                      fontWeight="bold"
                    >
                      F
                    </text>
                    {activeLayers.labels && (
                      <text y={-14} textAnchor="middle" className={styles.markerText}>
                        {fc.name}
                      </text>
                    )}
                  </g>
                ))}

              {/* Volunteer Station Overlays */}
              {activeLayers.volunteers &&
                volunteers.map((vs) => (
                  <g
                    key={vs.id}
                    transform={`translate(${vs.position.x}, ${vs.position.y}) translateZ(120px)`}
                    className={styles.markerGroup}
                    onMouseMove={(e) => handleVolunteerHover(e, vs)}
                    onMouseLeave={handleElementLeave}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedItem({ kind: 'volunteer', data: vs });
                    }}
                  >
                    <circle className={styles.markerPulse} r={10} fill="hsl(152, 60%, 48%)" />
                    <circle r={9} fill="hsl(152, 60%, 48%)" className={styles.markerPin} />
                    <text
                      y={3}
                      textAnchor="middle"
                      fontSize={8}
                      fill="var(--color-bg-root)"
                      fontWeight="bold"
                    >
                      V
                    </text>
                    {activeLayers.labels && (
                      <text y={-14} textAnchor="middle" className={styles.markerText}>
                        {vs.name}
                      </text>
                    )}
                  </g>
                ))}

              {/* Overlay Text Labels on Stadium Zones */}
              {activeLayers.labels &&
                zones.map((zone) => {
                  const isLayerHidden =
                    (!activeLayers.gates && zone.type === 'gate') ||
                    (!activeLayers.parking && zone.type === 'parking') ||
                    (!activeLayers.medical && zone.type === 'medical');

                  if (
                    isLayerHidden ||
                    zone.type === 'field' ||
                    zone.type === 'concourse' ||
                    zone.type === 'medical'
                  ) {
                    return null;
                  }

                  return (
                    <g
                      key={`label-${zone.id}`}
                      transform={`translate(${zone.center.x}, ${zone.center.y}) translateZ(${zone.layer * 30 + 10}px)`}
                      style={{ pointerEvents: 'none' }}
                    >
                      <text
                        textAnchor="middle"
                        className={styles.markerText}
                        fontSize={zone.type === 'stand' ? 11 : 9}
                      >
                        {zone.name}
                      </text>
                    </g>
                  );
                })}
            </svg>
          </div>

          {/* Floating HUD Viewport Controls */}
          <div className={styles.futureProjectionWrapper}>
            <FutureProjection />
          </div>

          <div className={styles.hudControls}>
            <button
              className={styles.hudButton}
              onClick={() => handleZoom(1.2)}
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              className={styles.hudButton}
              onClick={() => handleZoom(0.8)}
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              className={styles.hudButton}
              onClick={toggle3D}
              title={is3D ? 'Flat 2D View' : 'Perspective 3D View'}
              aria-label={is3D ? 'Switch to 2D view' : 'Switch to 3D view'}
            >
              <Compass size={16} style={{ transform: is3D ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>
            <button
              className={styles.hudButton}
              onClick={handleResetView}
              title="Reset View"
              aria-label="Reset view position"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <StadiumLegend />
      </div>

      {/* ═══ Sidebar HUD & Inspector Column (Right) ═══ */}
      <div className={styles.sidebarColumn}>
        {/* KPI Panel */}
        <div className={styles.statsCard}>
          <h3 style={{ fontSize: 'var(--text-micro)', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: 'var(--space-3)', letterSpacing: '0.05em' }}>
            Stadium Live KPIs
          </h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Attendance</span>
              <span className={styles.statValue}>
                <AnimatedNumber value={totalAttendance} />
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Avg Density</span>
              <span className={styles.statValue}>
                <AnimatedNumber value={avgDensity * 100} decimals={1} suffix="%" />
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Gates Open</span>
              <span className={styles.statValue}>
                {openGates} / {digitalTwinStats.totalGates}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Medical Cases</span>
              <span className={styles.statValue}>
                <AnimatedNumber value={activeMedicalCases} />
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border-primary)', paddingTop: 'var(--space-3)' }}>
            <Button
              variant={isSurging ? 'danger' : 'secondary'}
              size="sm"
              onClick={() => setIsSurging(!isSurging)}
              leftIcon={<Activity size={12} />}
              style={{ flex: 1 }}
            >
              {isSurging ? 'Stop Surge' : 'Simulate Surge'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetSimulator}
              leftIcon={<RotateCcw size={12} />}
            >
              Reset All
            </Button>
          </div>
        </div>

        {/* Selected Item Inspector Panel */}
        <Card
          variant="glass"
          className={styles.inspectorContainer}
          header={{
            title: selectedItem ? 'Inspector' : 'Live Inspector',
            icon: selectedItem ? <Info size={16} /> : <Compass size={16} className={styles.inspectorIcon} />,
          }}
        >
          {selectedItem ? (
            <div className={styles.inspectorContent}>
              <div className={styles.inspectorHeader}>
                <div className={styles.inspectorTitleBlock}>
                  <span className={styles.inspectorType}>{selectedItem.kind}</span>
                  <h3 className={styles.inspectorName}>{selectedItem.data.name}</h3>
                </div>
                <StatusBadge status={selectedItem.data.status} />
              </div>

              {/* Zone Details */}
              {selectedItem.kind === 'zone' && (
                <>
                  <div className={styles.simulatorControl}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.sliderLabel}>Simulator Occupancy</span>
                      <span className={styles.sliderValue}>
                        {selectedItem.data.currentOccupancy.toLocaleString()} /{' '}
                        {selectedItem.data.capacity.toLocaleString()}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={selectedItem.data.capacity}
                      value={selectedItem.data.currentOccupancy}
                      onChange={(e) =>
                        updateZoneOccupancy(selectedItem.data.id, parseInt(e.target.value))
                      }
                      className={styles.sliderInput}
                      disabled={evacuatingZones.has(selectedItem.data.id)}
                    />
                  </div>

                  <div className={styles.inspectorMetadata}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Layer</span>
                      <span className={styles.metaValue}>L{selectedItem.data.layer}</span>
                    </div>
                    {selectedItem.data.temperature !== undefined && (
                      <div className={styles.metaItem}>
                        <span className={styles.metaLabel}>Temperature</span>
                        <span className={styles.metaValue}>
                          {selectedItem.data.temperature.toFixed(1)}°C
                        </span>
                      </div>
                    )}
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Alert Status</span>
                      <span className={styles.metaValue}>
                        {selectedItem.data.alerts ?? 0} active alert{(selectedItem.data.alerts ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Density Ratio</span>
                      <span className={styles.metaValue}>
                        {((selectedItem.data.currentOccupancy / selectedItem.data.capacity) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Evacuation Simulations */}
                  {(selectedItem.data.type === 'stand' ||
                    selectedItem.data.type === 'vip' ||
                    selectedItem.data.type === 'concourse') && (
                      <div className={styles.evacuationBlock}>
                        {evacuatingZones.has(selectedItem.data.id) ? (
                          <div className={styles.evacTimerBlock}>
                            <div className={styles.evacTimerHeader}>
                              <span>⚠️ EVACUATING</span>
                              <span className={styles.evacTimeValue}>
                                {evacuationTimers[selectedItem.data.id] ?? 0}s remaining
                              </span>
                            </div>
                            <div className={styles.evacProgressBar}>
                              <div
                                className={styles.evacProgressFill}
                                style={{
                                  width: `${((evacuationTimers[selectedItem.data.id] ?? 0) / 15) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        ) : (
                          <Button
                            variant="danger"
                            size="md"
                            onClick={() => startEvacuation(selectedItem.data.id)}
                            leftIcon={<Flame size={16} />}
                            disabled={selectedItem.data.currentOccupancy === 0}
                          >
                            Simulate Evacuation
                          </Button>
                        )}
                      </div>
                    )}
                </>
              )}

              {/* Food Court Details */}
              {selectedItem.kind === 'food' && (
                <>
                  <div className={styles.simulatorControl}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.sliderLabel}>Simulator Queue Size</span>
                      <span className={styles.sliderValue}>
                        {selectedItem.data.queueLength} people
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={selectedItem.data.queueLength}
                      onChange={(e) =>
                        updateFoodCourtQueue(selectedItem.data.id, parseInt(e.target.value))
                      }
                      className={styles.sliderInput}
                    />
                  </div>

                  <div className={styles.inspectorMetadata}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Est. Wait Time</span>
                      <span className={styles.metaValue}>{selectedItem.data.waitTime}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Popular Dish</span>
                      <span className={styles.metaValue}>{selectedItem.data.popularItem}</span>
                    </div>
                  </div>

                  <div className={styles.simulatorControl}>
                    <span className={styles.metaLabel} style={{ marginBottom: 'var(--space-1)', display: 'block' }}>
                      Cuisine Tags
                    </span>
                    <div className={styles.tagsContainer}>
                      {selectedItem.data.menuTypes.map((menu) => (
                        <span key={menu} className={styles.tagItem}>
                          {menu}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Volunteer Station Details */}
              {selectedItem.kind === 'volunteer' && (
                <>
                  <div className={styles.simulatorControl}>
                    <div className={styles.sliderHeader}>
                      <span className={styles.sliderLabel}>Active Volunteers</span>
                      <span className={styles.sliderValue}>
                        {selectedItem.data.volunteerCount} members
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      value={selectedItem.data.volunteerCount}
                      onChange={(e) =>
                        updateVolunteerCount(selectedItem.data.id, parseInt(e.target.value))
                      }
                      className={styles.sliderInput}
                    />
                  </div>

                  <div className={styles.inspectorMetadata}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Shift Schedule</span>
                      <span className={styles.metaValue}>{selectedItem.data.shift}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Status</span>
                      <span className={styles.metaValue} style={{ textTransform: 'capitalize' }}>
                        {selectedItem.data.status}
                      </span>
                    </div>
                  </div>

                  <div className={styles.simulatorControl}>
                    <span className={styles.metaLabel} style={{ marginBottom: 'var(--space-1)', display: 'block' }}>
                      Assigned Roles
                    </span>
                    <div className={styles.tagsContainer}>
                      {selectedItem.data.roles.map((role) => (
                        <span key={role} className={styles.tagItem}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className={styles.emptyInspector}>
              <Compass size={40} className={styles.inspectorIcon} />
              <p style={{ fontSize: 'var(--text-sm)' }}>
                Select a zone or facility on the interactive map to inspect and simulate operations.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-2)' }}>
                <span className={styles.tagItem} style={{ fontSize: '10px' }}>Stands & Seats</span>
                <span className={styles.tagItem} style={{ fontSize: '10px' }}>Food Halls</span>
                <span className={styles.tagItem} style={{ fontSize: '10px' }}>Volunteers</span>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Floating Tooltip Component */}
      <StadiumTooltip
        target={hoveredItem}
        x={tooltipPos.x}
        y={tooltipPos.y}
        visible={hoveredItem !== null}
      />
    </div>
  );
}

export default DigitalTwin;
