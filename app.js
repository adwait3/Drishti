// XCode Drishti Dashboard JavaScript
class DrishtiDashboard {
    constructor() {
        this.currentData = {
            crowdData: {
                currentCount: 15247,
                predictedPeak: 18500,
                peakTime: "15 minutes",
                zones: [
                    {"id": "A", "name": "Main Stage", "capacity": 78, "count": 3120, "risk": "medium"},
                    {"id": "B", "name": "Food Court", "capacity": 45, "count": 1800, "risk": "low"},
                    {"id": "C", "name": "Entry Gate", "capacity": 92, "count": 4600, "risk": "high"},
                    {"id": "D", "name": "Parking", "capacity": 23, "count": 920, "risk": "low"},
                    {"id": "E", "name": "Exit Plaza", "capacity": 67, "count": 2680, "risk": "medium"},
                    {"id": "F", "name": "Vendor Area", "capacity": 34, "count": 1360, "risk": "low"}
                ]
            },
            alerts: [
                {"id": 1, "severity": "high", "message": "Crowd surge detected in Zone C", "time": "14:32", "status": "active"},
                {"id": 2, "severity": "medium", "message": "Exit blocked - Gate 3", "time": "14:28", "status": "active"},
                {"id": 3, "severity": "medium", "message": "High density in Zone A", "time": "14:25", "status": "acknowledged"},
                {"id": 4, "severity": "low", "message": "Weather alert - Light rain expected", "time": "14:20", "status": "resolved"}
            ],
            resources: {
                security: {"available": 12, "total": 18, "deployed": 6},
                medical: {"available": 4, "total": 6, "deployed": 2},
                fire: {"available": 2, "total": 3, "deployed": 1}
            },
            predictions: [
                {"time": "14:45", "zone": "A", "predicted_count": 4200, "risk_level": "high"},
                {"time": "15:00", "zone": "C", "predicted_count": 5100, "risk_level": "critical"},
                {"time": "15:15", "zone": "E", "predicted_count": 3800, "risk_level": "medium"}
            ]
        };

        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupTimeUpdates();
        this.setupModalFunctionality();
        this.setupZoneInteractions();
        this.setupEmergencyDispatch();
        this.setupAlertSystem();
        this.loadInitialData();
        this.startDataUpdates();
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Update header title
                const section = item.getAttribute('data-section');
                const headerTitle = document.querySelector('.header-left h1');
                headerTitle.textContent = this.getSectionTitle(section);
                
                // Show/hide appropriate sections
                this.showSection(section);
            });
        });
    }

    getSectionTitle(section) {
        const titles = {
            'dashboard': 'Dashboard',
            'live-feed': 'Live Feed',
            'analytics': 'Analytics',
            'emergency': 'Emergency Response',
            'risk': 'Risk Assessment',
            'settings': 'Settings'
        };
        return titles[section] || 'Dashboard';
    }

    showSection(section) {
        // Show all sections for dashboard, hide others for different views
        const dashboardGrid = document.querySelector('.dashboard-grid');
        const sections = dashboardGrid.querySelectorAll('section');
        
        if (section === 'dashboard') {
            sections.forEach(s => s.style.display = 'block');
        } else if (section === 'live-feed') {
            sections.forEach(s => s.style.display = 'none');
            document.querySelector('.video-feeds').style.display = 'block';
        } else if (section === 'analytics') {
            sections.forEach(s => s.style.display = 'none');
            document.querySelector('.analytics-panel').style.display = 'block';
            document.querySelector('.map-section').style.display = 'block';
        } else if (section === 'emergency') {
            sections.forEach(s => s.style.display = 'none');
            document.querySelector('.emergency-panel').style.display = 'block';
            document.querySelector('.alerts-panel').style.display = 'block';
        } else if (section === 'risk') {
            sections.forEach(s => s.style.display = 'none');
            document.querySelector('.predictions-panel').style.display = 'block';
            document.querySelector('.map-section').style.display = 'block';
        } else {
            sections.forEach(s => s.style.display = 'none');
        }
    }

    setupTimeUpdates() {
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    updateDateTime() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        const dateStr = now.toLocaleDateString('en-US', options);
        const timeStr = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });

        document.getElementById('current-date').textContent = dateStr;
        document.getElementById('current-time').textContent = timeStr;
    }

    setupModalFunctionality() {
        const modal = document.getElementById('zone-modal');
        const closeBtn = document.querySelector('.modal-close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    setupZoneInteractions() {
        const zoneAreas = document.querySelectorAll('.zone-area');
        const videoFeeds = document.querySelectorAll('.video-feed');

        [...zoneAreas, ...videoFeeds].forEach(element => {
            element.addEventListener('click', (e) => {
                const zoneId = element.getAttribute('data-zone');
                this.showZoneDetails(zoneId);
            });
        });
    }

    showZoneDetails(zoneId) {
        const zone = this.currentData.crowdData.zones.find(z => z.id === zoneId);
        if (!zone) return;

        const modal = document.getElementById('zone-modal');
        const title = document.getElementById('modal-zone-title');
        const content = document.getElementById('modal-zone-content');

        title.textContent = `Zone ${zone.id} - ${zone.name}`;
        
        const riskColor = zone.risk === 'high' ? '#ef4444' : 
                         zone.risk === 'medium' ? '#fbbf24' : '#22c55e';

        content.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-bottom: 20px;">
                <div style="background: rgba(42, 52, 65, 0.3); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #ffffff; margin-bottom: 8px;">Current Status</h4>
                    <p style="color: #9ca3af; margin-bottom: 4px;">Capacity: ${zone.capacity}%</p>
                    <p style="color: #9ca3af; margin-bottom: 4px;">Count: ${zone.count.toLocaleString()}</p>
                    <p style="color: ${riskColor}; font-weight: 500;">Risk Level: ${zone.risk.toUpperCase()}</p>
                </div>
                <div style="background: rgba(42, 52, 65, 0.3); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #ffffff; margin-bottom: 8px;">Predictions</h4>
                    <p style="color: #9ca3af; margin-bottom: 4px;">Expected Peak: ${Math.round(zone.count * 1.2).toLocaleString()}</p>
                    <p style="color: #9ca3af; margin-bottom: 4px;">Time to Peak: 12 min</p>
                    <p style="color: #f59e0b; font-weight: 500;">Trend: Increasing</p>
                </div>
            </div>
            <div style="background: rgba(42, 52, 65, 0.3); padding: 16px; border-radius: 8px;">
                <h4 style="color: #ffffff; margin-bottom: 12px;">Recent Activity</h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div style="font-size: 14px; color: #9ca3af;">• Crowd density increased by 15% in last 10 minutes</div>
                    <div style="font-size: 14px; color: #9ca3af;">• Flow pattern: Normal</div>
                    <div style="font-size: 14px; color: #9ca3af;">• Sentiment analysis: 75% positive</div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
    }

    setupEmergencyDispatch() {
        const dispatchButtons = document.querySelectorAll('.dispatch-btn');
        
        dispatchButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = btn.getAttribute('data-type');
                this.dispatchEmergencyTeam(type);
            });
        });

        const emergencyBtn = document.querySelector('.emergency-btn');
        emergencyBtn.addEventListener('click', () => {
            this.activateEmergencyProtocol();
        });
    }

    dispatchEmergencyTeam(type) {
        const teamNames = {
            'security': 'Security Team',
            'medical': 'Medical Team',
            'fire': 'Fire Safety Team'
        };

        // Simulate dispatch
        const btn = document.querySelector(`[data-type="${type}"]`);
        const originalText = btn.innerHTML;
        
        btn.innerHTML = `
            <span>Dispatching...</span>
            <span class="response-time">~0 sec</span>
        `;
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            
            // Add confirmation alert
            this.addAlert('low', `${teamNames[type]} dispatched successfully`, 'now');
        }, 2000);

        // Update available resources
        const resource = this.currentData.resources[type];
        if (resource.available > 0) {
            resource.available--;
            resource.deployed++;
            this.updateResourceDisplay();
        }
    }

    activateEmergencyProtocol() {
        const btn = document.querySelector('.emergency-btn');
        const originalText = btn.textContent;
        
        btn.textContent = 'Activating...';
        btn.disabled = true;
        btn.style.background = 'linear-gradient(135deg, #991b1b 0%, #7f1d1d 100%)';

        setTimeout(() => {
            btn.textContent = 'Protocol Active';
            btn.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
            
            // Add emergency alert
            this.addAlert('critical', 'Emergency protocol activated - All teams on standby', 'now');
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
            }, 5000);
        }, 2000);
    }

    setupAlertSystem() {
        // Initialize alerts display
        this.renderAlerts();
        this.renderPredictions();
        this.updateAlertCounts();
        
        // Add click handlers for alert counters
        const alertCounts = document.querySelectorAll('.alert-count');
        alertCounts.forEach(counter => {
            counter.addEventListener('click', () => {
                // Scroll to alerts panel
                const alertsPanel = document.querySelector('.alerts-panel');
                alertsPanel.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    addAlert(severity, message, time) {
        const newAlert = {
            id: Date.now(),
            severity,
            message,
            time,
            status: 'active'
        };
        
        this.currentData.alerts.unshift(newAlert);
        this.renderAlerts();
        this.updateAlertCounts();
    }

    renderAlerts() {
        const alertsFeed = document.getElementById('alerts-feed');
        
        if (!alertsFeed) return;
        
        alertsFeed.innerHTML = this.currentData.alerts.map(alert => `
            <div class="alert-item ${alert.severity}" data-alert-id="${alert.id}">
                <div class="alert-icon">
                    ${alert.severity === 'critical' ? '🚨' : 
                      alert.severity === 'high' ? '⚠️' : 
                      alert.severity === 'medium' ? '🟡' : 'ℹ️'}
                </div>
                <div class="alert-content">
                    <div class="alert-message">${alert.message}</div>
                    <div class="alert-time">${alert.time}</div>
                </div>
                <div class="alert-actions">
                    ${alert.status === 'active' ? `
                        <button class="alert-action acknowledge" onclick="dashboard.acknowledgeAlert(${alert.id})">
                            Acknowledge
                        </button>
                    ` : ''}
                    <button class="alert-action dismiss" onclick="dashboard.dismissAlert(${alert.id})">
                        Dismiss
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderPredictions() {
        const predictionList = document.getElementById('prediction-list');
        
        if (!predictionList) return;
        
        predictionList.innerHTML = this.currentData.predictions.map(prediction => `
            <div class="prediction-item">
                <div class="prediction-info">
                    <div class="prediction-zone">Zone ${prediction.zone} surge predicted</div>
                    <div class="prediction-time">${prediction.time} - ${prediction.predicted_count.toLocaleString()} people</div>
                </div>
                <div class="prediction-risk ${prediction.risk_level}">
                    ${prediction.risk_level.toUpperCase()}
                </div>
            </div>
        `).join('');
    }

    acknowledgeAlert(alertId) {
        const alert = this.currentData.alerts.find(a => a.id === alertId);
        if (alert) {
            alert.status = 'acknowledged';
            this.renderAlerts();
            this.updateAlertCounts();
        }
    }

    dismissAlert(alertId) {
        this.currentData.alerts = this.currentData.alerts.filter(a => a.id !== alertId);
        this.renderAlerts();
        this.updateAlertCounts();
    }

    updateAlertCounts() {
        const counts = {
            critical: 0,
            high: 0,
            medium: 0
        };

        this.currentData.alerts.forEach(alert => {
            if (alert.status === 'active') {
                counts[alert.severity]++;
            }
        });

        const criticalCount = document.querySelector('.alert-count.critical .count');
        const highCount = document.querySelector('.alert-count.high .count');
        const mediumCount = document.querySelector('.alert-count.medium .count');
        
        if (criticalCount) criticalCount.textContent = counts.critical;
        if (highCount) highCount.textContent = counts.high;
        if (mediumCount) mediumCount.textContent = counts.medium;
    }

    updateResourceDisplay() {
        const resources = this.currentData.resources;
        
        const securityCount = document.querySelector('.resource-item:nth-child(1) .resource-count');
        const medicalCount = document.querySelector('.resource-item:nth-child(2) .resource-count');
        const fireCount = document.querySelector('.resource-item:nth-child(3) .resource-count');
        
        if (securityCount) securityCount.textContent = `${resources.security.available}/${resources.security.total}`;
        if (medicalCount) medicalCount.textContent = `${resources.medical.available}/${resources.medical.total}`;
        if (fireCount) fireCount.textContent = `${resources.fire.available}/${resources.fire.total}`;
    }

    loadInitialData() {
        // Update crowd statistics
        const currentCount = document.getElementById('current-count');
        const predictedPeak = document.getElementById('predicted-peak');
        const peakTime = document.getElementById('peak-time');
        
        if (currentCount) currentCount.textContent = this.currentData.crowdData.currentCount.toLocaleString();
        if (predictedPeak) predictedPeak.textContent = this.currentData.crowdData.predictedPeak.toLocaleString();
        if (peakTime) peakTime.textContent = this.currentData.crowdData.peakTime.replace('minutes', 'min');

        // Calculate average density
        const avgDensity = Math.round(
            this.currentData.crowdData.zones.reduce((sum, zone) => sum + zone.capacity, 0) / 
            this.currentData.crowdData.zones.length
        );
        const avgDensityElement = document.getElementById('avg-density');
        if (avgDensityElement) avgDensityElement.textContent = `${avgDensity}%`;

        this.updateAlertCounts();
        this.updateResourceDisplay();
    }

    startDataUpdates() {
        // Simulate real-time data updates
        setInterval(() => {
            this.updateLiveData();
        }, 5000);

        // Update last updated timestamp
        setInterval(() => {
            const lastUpdated = document.getElementById('last-updated');
            if (lastUpdated) lastUpdated.textContent = 'now';
        }, 1000);
    }

    updateLiveData() {
        // Simulate slight changes in crowd data
        this.currentData.crowdData.zones.forEach(zone => {
            const change = Math.random() * 10 - 5; // -5 to +5
            zone.capacity = Math.max(0, Math.min(100, zone.capacity + change));
            zone.count = Math.round(zone.count * (1 + change / 200));
        });

        // Update current count
        this.currentData.crowdData.currentCount = this.currentData.crowdData.zones.reduce(
            (sum, zone) => sum + zone.count, 0
        );

        // Update displays
        const currentCount = document.getElementById('current-count');
        if (currentCount) currentCount.textContent = this.currentData.crowdData.currentCount.toLocaleString();

        const avgDensity = Math.round(
            this.currentData.crowdData.zones.reduce((sum, zone) => sum + zone.capacity, 0) / 
            this.currentData.crowdData.zones.length
        );
        const avgDensityElement = document.getElementById('avg-density');
        if (avgDensityElement) avgDensityElement.textContent = `${avgDensity}%`;

        // Update video feed overlays
        this.currentData.crowdData.zones.forEach(zone => {
            const videoFeed = document.querySelector(`[data-zone="${zone.id}"] .density-indicator`);
            if (videoFeed) {
                videoFeed.textContent = `${Math.round(zone.capacity)}% Capacity`;
                videoFeed.className = `density-indicator ${zone.capacity > 80 ? 'high' : zone.capacity > 50 ? 'medium' : 'low'}`;
            }
        });

        // Update map indicators
        this.currentData.crowdData.zones.forEach(zone => {
            const mapIndicator = document.querySelector(`[data-zone="${zone.id}"] .crowd-indicator`);
            if (mapIndicator) {
                mapIndicator.className = `crowd-indicator ${zone.capacity > 80 ? 'high' : zone.capacity > 50 ? 'medium' : 'low'}`;
            }
        });

        // Randomly add new alerts (low probability)
        if (Math.random() < 0.05) {
            const randomMessages = [
                'Crowd density spike detected in Zone B',
                'Unusual crowd movement pattern observed',
                'Queue forming at Exit Gate 2',
                'Weather conditions changing'
            ];
            
            const severities = ['low', 'medium'];
            const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
            const randomSeverity = severities[Math.floor(Math.random() * severities.length)];
            
            this.addAlert(randomSeverity, randomMessage, 'now');
        }
    }
}

// Initialize dashboard when page loads
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new DrishtiDashboard();
});

// Additional utility functions
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
}

function getRiskColor(risk) {
    switch (risk) {
        case 'critical': return '#dc2626';
        case 'high': return '#ef4444';
        case 'medium': return '#fbbf24';
        case 'low': return '#22c55e';
        default: return '#9ca3af';
    }
}

// Map view toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const mapControls = document.querySelectorAll('.map-controls .btn');
    
    mapControls.forEach(btn => {
        btn.addEventListener('click', () => {
            mapControls.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.getAttribute('data-view');
            console.log('Switching map view to:', view);
            // In a real implementation, this would change the map visualization
        });
    });
});