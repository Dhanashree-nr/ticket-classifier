import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, User, Tag, TrendingUp } from 'lucide-react';

// Enhanced training data with more examples
const TRAINING_DATA = [
  // Authentication & Access
  { text: "I forgot my password, how to reset it?", category: "Authentication & Access", subcategory: "Password reset", priority: "Medium" },
  { text: "I can't log in, password is incorrect", category: "Authentication & Access", subcategory: "Login issues", priority: "Medium" },
  { text: "My account is locked out", category: "Authentication & Access", subcategory: "Account lockouts", priority: "High" },
  { text: "2FA not working", category: "Authentication & Access", subcategory: "Two-factor authentication", priority: "High" },
  { text: "Reset my password please", category: "Authentication & Access", subcategory: "Password reset", priority: "Medium" },
  { text: "Cannot access my account", category: "Authentication & Access", subcategory: "Login issues", priority: "Medium" },
  { text: "Password expired", category: "Authentication & Access", subcategory: "Password reset", priority: "Medium" },
  { text: "Login button not responding", category: "Authentication & Access", subcategory: "Login issues", priority: "Medium" },
  
  // Account Management
  { text: "How to see leave balance?", category: "Account Management", subcategory: "Leave balance", priority: "Low" },
  { text: "Update my profile information", category: "Account Management", subcategory: "Profile updates", priority: "Low" },
  { text: "Check my vacation days", category: "Account Management", subcategory: "Leave balance", priority: "Low" },
  { text: "Change my email address", category: "Account Management", subcategory: "Profile updates", priority: "Low" },
  { text: "How many sick days do I have?", category: "Account Management", subcategory: "Leave balance", priority: "Low" },
  { text: "Delete my account", category: "Account Management", subcategory: "Account deletion", priority: "High" },
  { text: "Update personal details", category: "Account Management", subcategory: "Profile updates", priority: "Low" },
  
  // Technical Issues
  { text: "Application keeps crashing", category: "Technical Issues", subcategory: "Application errors", priority: "High" },
  { text: "Page loading very slow", category: "Technical Issues", subcategory: "Performance problems", priority: "Medium" },
  { text: "Error 500 when submitting form", category: "Technical Issues", subcategory: "Application errors", priority: "High" },
  { text: "Data not syncing properly", category: "Technical Issues", subcategory: "Data sync problems", priority: "Medium" },
  { text: "Feature not working", category: "Technical Issues", subcategory: "Feature malfunctions", priority: "Medium" },
  { text: "System down", category: "Technical Issues", subcategory: "Application errors", priority: "High" },
  { text: "Integration failed", category: "Technical Issues", subcategory: "Integration issues", priority: "Medium" },
  
  // Feature Requests & Questions
  { text: "How to export data?", category: "Feature Requests & Questions", subcategory: "How-to questions", priority: "Low" },
  { text: "Can we get dark mode?", category: "Feature Requests & Questions", subcategory: "Feature requests", priority: "Low" },
  { text: "Need training on new features", category: "Feature Requests & Questions", subcategory: "Training needs", priority: "Low" },
  { text: "Where is the user manual?", category: "Feature Requests & Questions", subcategory: "Documentation requests", priority: "Low" },
  { text: "How do I create a report?", category: "Feature Requests & Questions", subcategory: "How-to questions", priority: "Low" },
  { text: "Request new dashboard feature", category: "Feature Requests & Questions", subcategory: "Feature requests", priority: "Low" },
  
  // Billing & Subscriptions
  { text: "Payment failed", category: "Billing & Subscriptions", subcategory: "Payment issues", priority: "High" },
  { text: "Need invoice copy", category: "Billing & Subscriptions", subcategory: "Invoice questions", priority: "Low" },
  { text: "Upgrade subscription", category: "Billing & Subscriptions", subcategory: "Subscription changes", priority: "Medium" },
  { text: "Cancel my plan", category: "Billing & Subscriptions", subcategory: "Subscription changes", priority: "Medium" },
  { text: "Wrong charge on card", category: "Billing & Subscriptions", subcategory: "Billing disputes", priority: "High" },
  { text: "Downgrade account", category: "Billing & Subscriptions", subcategory: "Subscription changes", priority: "Medium" }
];

// Category definitions with keywords
const CATEGORIES = {
  "Authentication & Access": {
    keywords: ["password", "login", "forgot", "reset", "access", "authenticate", "locked", "2fa", "credentials", "sign", "unlock"],
    subcategories: ["Password reset", "Login issues", "Account lockouts", "Two-factor authentication"],
    color: "#ef4444"
  },
  "Account Management": {
    keywords: ["balance", "profile", "update", "information", "leave", "vacation", "personal", "account", "details", "sick", "days"],
    subcategories: ["Profile updates", "Leave balance", "Account deletion", "Personal data"],
    color: "#3b82f6"
  },
  "Technical Issues": {
    keywords: ["error", "bug", "not working", "slow", "crash", "broken", "malfunction", "sync", "down", "failed", "500", "loading"],
    subcategories: ["Application errors", "Performance problems", "Feature malfunctions", "Data sync problems", "Integration issues"],
    color: "#f59e0b"
  },
  "Feature Requests & Questions": {
    keywords: ["how to", "can i", "feature", "request", "training", "help", "guide", "documentation", "manual", "export", "create"],
    subcategories: ["How-to questions", "Feature requests", "Training needs", "Documentation requests"],
    color: "#10b981"
  },
  "Billing & Subscriptions": {
    keywords: ["payment", "billing", "invoice", "subscription", "charge", "upgrade", "cancel", "plan", "failed", "card", "downgrade"],
    subcategories: ["Payment issues", "Invoice questions", "Subscription changes", "Billing disputes"],
    color: "#8b5cf6"
  }
};

// Simple NLP-like classification function
function classifyTicket(text) {
  const normalizedText = text.toLowerCase();
  const words = normalizedText.split(/\s+/);
  
  let bestMatch = null;
  let bestScore = 0;
  let matchedKeywords = [];
  
  // Score each category based on keyword matches
  for (const [categoryName, categoryData] of Object.entries(CATEGORIES)) {
    let score = 0;
    let categoryKeywords = [];
    
    for (const keyword of categoryData.keywords) {
      if (normalizedText.includes(keyword)) {
        // Weight longer keywords more heavily
        const weight = keyword.split(' ').length;
        score += weight;
        categoryKeywords.push(keyword);
      }
    }
    
    // Bonus for exact phrase matches
    if (score > 0) {
      score += 0.5;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = categoryName;
      matchedKeywords = categoryKeywords;
    }
  }
  
  // Determine subcategory based on specific keywords
  let subcategory = "General";
  let priority = "Medium";
  
  if (bestMatch && bestScore > 0) {
    // Find best subcategory match
    const categoryData = CATEGORIES[bestMatch];
    for (const sub of categoryData.subcategories) {
      const subKeywords = sub.toLowerCase().split(' ');
      if (subKeywords.some(keyword => normalizedText.includes(keyword))) {
        subcategory = sub;
        break;
      }
    }
    
    // Determine priority based on keywords
    const highPriorityWords = ["crash", "down", "failed", "locked", "error", "not working", "urgent", "critical"];
    const lowPriorityWords = ["how to", "question", "information", "balance", "update"];
    
    if (highPriorityWords.some(word => normalizedText.includes(word))) {
      priority = "High";
    } else if (lowPriorityWords.some(word => normalizedText.includes(word))) {
      priority = "Low";
    }
  }
  
  const confidence = bestScore > 0 ? Math.min(0.95, (bestScore / words.length) * 2) : 0.3;
  
  return {
    category: bestMatch || "General Inquiry",
    subcategory,
    priority,
    confidence: confidence,
    matchedKeywords,
    autoResponse: generateAutoResponse(bestMatch, subcategory)
  };
}

function generateAutoResponse(category, subcategory) {
  const responses = {
    "Authentication & Access": {
      "Password reset": "A password reset link has been sent to your email. Please check your inbox and spam folder.",
      "Login issues": "Please verify your username and try again. If the issue persists, contact IT support.",
      "Account lockouts": "Your account has been unlocked. Please try logging in again.",
      "Two-factor authentication": "Please ensure your authenticator app is synced. Contact IT if issues persist."
    },
    "Account Management": {
      "Leave balance": "You can check your leave balance in the employee portal under 'Time Off' section.",
      "Profile updates": "Profile updates can be made in your account settings. Some changes may require manager approval.",
      "Account deletion": "Your account deletion request has been forwarded to the data protection team."
    },
    "Technical Issues": {
      "Application errors": "This issue has been logged and forwarded to our technical team. We'll update you within 4 hours.",
      "Performance problems": "We're investigating performance issues. Please try clearing your cache as a temporary solution."
    }
  };
  
  return responses[category]?.[subcategory] || "Thank you for your inquiry. Our support team will respond within 24 hours.";
}

export default function TicketClassifier() {
  const [inputText, setInputText] = useState("");
  const [classification, setClassification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analytics, setAnalytics] = useState({});

  const handleClassify = async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      const result = classifyTicket(inputText);
      setClassification(result);
      setIsProcessing(false);
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        [result.category]: (prev[result.category] || 0) + 1
      }));
    }, 500);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High": return { color: "#dc2626", backgroundColor: "#fee2e2" };
      case "Medium": return { color: "#d97706", backgroundColor: "#fef3c7" };
      case "Low": return { color: "#059669", backgroundColor: "#d1fae5" };
      default: return { color: "#6b7280", backgroundColor: "#f3f4f6" };
    }
  };

  const getCategoryColor = (category) => {
    const categoryData = CATEGORIES[category];
    if (!categoryData) return { color: "#6b7280", backgroundColor: "#f3f4f6" };
    
    return {
      color: categoryData.color,
      backgroundColor: categoryData.color + "20"
    };
  };

  const sampleTickets = [
    "I forgot my password, how to reset it?",
    "I can't log in, password is incorrect",
    "How to see leave balance?",
    "Application keeps crashing",
    "Need invoice copy",
    "How to export data?"
  ];

  // Styles object
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '32px',
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    subtitle: {
      color: '#6b7280',
      marginBottom: '24px',
      fontSize: '16px'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    textarea: {
      width: '100%',
      padding: '16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      resize: 'none',
      fontSize: '14px',
      fontFamily: 'inherit'
    },
    button: {
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      fontSize: '16px',
      transition: 'background-color 0.15s'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    quickExamples: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '16px',
      alignItems: 'center'
    },
    exampleButton: {
      fontSize: '12px',
      padding: '6px 12px',
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      borderRadius: '20px',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.15s'
    },
    resultsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    },
    resultCard: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '16px'
    },
    resultTitle: {
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px'
    },
    badge: {
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '500'
    },
    progressBar: {
      width: '100%',
      height: '8px',
      backgroundColor: '#e5e7eb',
      borderRadius: '4px',
      overflow: 'hidden',
      marginRight: '12px'
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px'
    },
    progressContainer: {
      display: 'flex',
      alignItems: 'center'
    },
    keywordContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px'
    },
    keyword: {
      padding: '2px 8px',
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderRadius: '12px',
      fontSize: '11px'
    },
    autoResponse: {
      backgroundColor: '#eff6ff',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #bfdbfe'
    },
    analyticsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px'
    },
    analyticsCard: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      textAlign: 'center'
    },
    analyticsCount: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    analyticsLabel: {
      fontSize: '12px',
      color: '#6b7280'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          <Tag color="#3b82f6" />
          AI Ticket Classification System
        </h1>
        <p style={styles.subtitle}>
          Automatically classify and route support tickets using AI-powered text analysis
        </p>
        
        <div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Enter Support Ticket
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your issue or question..."
              style={styles.textarea}
              rows="4"
            />
          </div>
          
          <div style={styles.quickExamples}>
            <span style={{fontSize: '14px', color: '#6b7280'}}>Quick examples:</span>
            {sampleTickets.map((ticket, index) => (
              <button
                key={index}
                onClick={() => setInputText(ticket)}
                style={styles.exampleButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#eff6ff'}
              >
                {ticket.substring(0, 30)}...
              </button>
            ))}
          </div>
          
          <button
            onClick={handleClassify}
            disabled={!inputText.trim() || isProcessing}
            style={{
              ...styles.button,
              ...((!inputText.trim() || isProcessing) ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => {
              if (!e.target.disabled) e.target.style.backgroundColor = '#1d4ed8'
            }}
            onMouseOut={(e) => {
              if (!e.target.disabled) e.target.style.backgroundColor = '#3b82f6'
            }}
          >
            {isProcessing ? (
              <>
                <Clock size={16} style={{animation: 'spin 1s linear infinite'}} />
                Processing...
              </>
            ) : (
              "Classify Ticket"
            )}
          </button>
        </div>
      </div>

      {classification && (
        <div style={styles.card}>
          <h2 style={{...styles.title, fontSize: '24px'}}>
            <CheckCircle color="#10b981" />
            Classification Results
          </h2>
          
          <div style={styles.resultsGrid}>
            <div>
              <div style={styles.resultCard}>
                <h3 style={styles.resultTitle}>Primary Category</h3>
                <span style={{
                  ...styles.badge,
                  ...getCategoryColor(classification.category)
                }}>
                  {classification.category}
                </span>
              </div>
              
              <div style={styles.resultCard}>
                <h3 style={styles.resultTitle}>Subcategory</h3>
                <span>{classification.subcategory}</span>
              </div>
              
              <div style={styles.resultCard}>
                <h3 style={styles.resultTitle}>Priority Level</h3>
                <span style={{
                  ...styles.badge,
                  ...getPriorityColor(classification.priority)
                }}>
                  {classification.priority}
                </span>
              </div>
              
              <div style={styles.resultCard}>
                <h3 style={styles.resultTitle}>Confidence Score</h3>
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${classification.confidence * 100}%`
                      }}
                    ></div>
                  </div>
                  <span style={{fontSize: '14px', color: '#6b7280'}}>
                    {Math.round(classification.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <div style={styles.autoResponse}>
                <h3 style={{...styles.resultTitle, display: 'flex', alignItems: 'center', gap: '8px'}}>
                  <AlertCircle size={16} />
                  Auto-Response
                </h3>
                <p style={{color: '#374151', fontSize: '14px', lineHeight: 1.5, margin: 0}}>
                  {classification.autoResponse}
                </p>
              </div>
              
              {classification.matchedKeywords.length > 0 && (
                <div style={styles.resultCard}>
                  <h3 style={styles.resultTitle}>Matched Keywords</h3>
                  <div style={styles.keywordContainer}>
                    {classification.matchedKeywords.map((keyword, index) => (
                      <span key={index} style={styles.keyword}>
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div style={{...styles.resultCard, backgroundColor: '#fefce8'}}>
                <h3 style={styles.resultTitle}>Routing Recommendation</h3>
                <p style={{fontSize: '14px', color: '#374151', margin: 0}}>
                  <strong>Route to:</strong> {classification.category} team<br />
                  <strong>SLA:</strong> {
                    classification.priority === 'High' ? '2 hours' : 
                    classification.priority === 'Medium' ? '8 hours' : '24 hours'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {Object.keys(analytics).length > 0 && (
        <div style={styles.card}>
          <h2 style={{...styles.title, fontSize: '24px'}}>
            <TrendingUp color="#8b5cf6" />
            Classification Analytics
          </h2>
          
          <div style={styles.analyticsGrid}>
            {Object.entries(analytics).map(([category, count]) => (
              <div key={category} style={styles.analyticsCard}>
                <div style={{
                  ...styles.badge,
                  ...getCategoryColor(category),
                  marginBottom: '8px'
                }}>
                  {category}
                </div>
                <div style={styles.analyticsCount}>{count}</div>
                <div style={styles.analyticsLabel}>tickets</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}