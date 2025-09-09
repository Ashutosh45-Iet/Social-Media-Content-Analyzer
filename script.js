class EnhancedContentAnalyzer {
    constructor() {
        this.setupEventListeners();
        this.setupPdfWorker();
        this.createBackgroundAnimation();
        this.initializeCharts();
        this.platformTemplates = this.initializePlatformTemplates();
    }
    setupPdfWorker() {
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }
    createBackgroundAnimation() {
        const bgAnimation = document.getElementById('bgAnimation');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            bgAnimation.appendChild(particle);
        }
    }

    initializeCharts() {
        this.chartInstances = {};
    }

    initializePlatformTemplates() {
        return {
            twitter: { maxChars: 280, icon: 'fab fa-twitter', color: '#1da1f2' },
            facebook: { maxChars: 63206, icon: 'fab fa-facebook', color: '#4267b2' },
            instagram: { maxChars: 2200, icon: 'fab fa-instagram', color: '#e4405f' },
            linkedin: { maxChars: 3000, icon: 'fab fa-linkedin', color: '#0077b5' },
            tiktok: { maxChars: 150, icon: 'fab fa-tiktok', color: '#000' }
        };
    }

    setupEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dropZone.addEventListener('drop', this.handleDrop.bind(this));
        fileInput.addEventListener('change', this.handleFileSelect.bind(this));

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    async processFiles(files) {
        const results = document.getElementById('results');
        results.innerHTML = '';

        for (const file of files) {
            await this.processFile(file);
        }
    }

    async processFile(file) {
        const results = document.getElementById('results');
        const fileContainer = document.createElement('div');
        fileContainer.style.marginBottom = '40px';

        const fileInfo = this.createFileInfo(file);
        fileContainer.appendChild(fileInfo);

        const loadingDiv = this.createLoadingState();
        fileContainer.appendChild(loadingDiv);

        results.appendChild(fileContainer);

        try {
            let extractedText = '';
            
            if (file.type === 'application/pdf') {
                extractedText = await this.extractTextFromPDF(file, loadingDiv);
            } else if (file.type.startsWith('image/')) {
                extractedText = await this.extractTextFromImage(file, loadingDiv);
            } else if (file.type.includes('text') || file.name.endsWith('.txt')) {
                extractedText = await this.extractTextFromFile(file, loadingDiv);
            } else {
                throw new Error('Unsupported file type');
            }

            loadingDiv.remove();
            this.displayEnhancedResults(fileContainer, extractedText, file.name);

        } catch (error) {
            loadingDiv.innerHTML = `<div class="error"><i class="fas fa-exclamation-triangle"></i> Error processing ${file.name}: ${error.message}</div>`;
        }
    }

    createFileInfo(file) {
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        
        let icon = 'fas fa-file';
        if (file.type === 'application/pdf') icon = 'fas fa-file-pdf';
        else if (file.type.startsWith('image/')) icon = 'fas fa-image';
        else if (file.type.includes('text')) icon = 'fas fa-file-alt';
        else if (file.name.endsWith('.docx')) icon = 'fas fa-file-word';
        
        const size = (file.size / 1024 / 1024).toFixed(2);
        
        fileInfo.innerHTML = `
            <div class="file-icon"><i class="${icon}" style="color: var(--purple);"></i></div>
            <div class="file-details">
                <h4>${file.name}</h4>
                <p>${file.type || 'Unknown type'} • ${size} MB</p>
            </div>
        `;
        return fileInfo;
    }

    createLoadingState() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = `
            <div class="spinner"></div>
            <p style="font-weight: 600;">AI Processing in Progress...</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <p id="status" style="opacity: 0.8;">Initializing advanced analysis...</p>
        `;
        return loadingDiv;
    }

    async extractTextFromPDF(file, loadingDiv) {
        const statusEl = loadingDiv.querySelector('#status');
        const progressFill = loadingDiv.querySelector('.progress-fill');
        
        statusEl.textContent = 'Loading PDF with AI...';
        progressFill.style.width = '20%';

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        
        statusEl.textContent = 'Extracting intelligent content...';
        progressFill.style.width = '50%';

        let fullText = '';
        const numPages = pdf.numPages;

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `${pageText}\n`;
            
            progressFill.style.width = `${50 + (pageNum / numPages) * 50}%`;
            statusEl.textContent = `AI analyzing page ${pageNum}/${numPages}...`;
        }

        return fullText.trim();
    }

    async extractTextFromImage(file, loadingDiv) {
        const statusEl = loadingDiv.querySelector('#status');
        const progressFill = loadingDiv.querySelector('.progress-fill');

        statusEl.textContent = 'Initializing advanced OCR...';
        progressFill.style.width = '10%';

        return new Promise((resolve, reject) => {
            Tesseract.recognize(file, 'eng', {
                logger: m => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        progressFill.style.width = `${10 + progress * 0.9}%`;
                        statusEl.textContent = `AI reading text: ${progress}%`;
                    } else {
                        statusEl.textContent = `AI ${m.status.replace('_', ' ')}...`;
                    }
                }
            }).then(({ data: { text } }) => {
                resolve(text);
            }).catch(reject);
        });
    }

    async extractTextFromFile(file, loadingDiv) {
        const statusEl = loadingDiv.querySelector('#status');
        const progressFill = loadingDiv.querySelector('.progress-fill');
        
        statusEl.textContent = 'Reading text file...';
        progressFill.style.width = '50%';
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                progressFill.style.width = '100%';
                resolve(e.target.result);
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    displayEnhancedResults(container, text, filename) {
        // Advanced text analysis
        const analysis = this.performAdvancedAnalysis(text);
        const sentiment = this.analyzeSentiment(text);
        const keywords = this.extractKeywords(text);
        const readability = this.calculateReadability(text);

        const resultsHTML = `
            <div class="content-tabs">
                <button class="content-tab active" data-content="overview">
                    <i class="fas fa-chart-pie"></i> Overview
                </button>
                <button class="content-tab" data-content="sentiment">
                    <i class="fas fa-heart"></i> Sentiment
                </button>
                <button class="content-tab" data-content="keywords">
                    <i class="fas fa-tags"></i> Keywords
                </button>
                <button class="content-tab" data-content="platforms">
                    <i class="fas fa-share-alt"></i> Platforms
                </button>
                <button class="content-tab" data-content="content">
                    <i class="fas fa-file-text"></i> Content
                </button>
            </div>

            <div class="tab-content active" data-content="overview">
                <div class="analytics">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-font"></i></div>
                        <div class="stat-number">${analysis.words}</div>
                        <div class="stat-label">Words</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-paragraph"></i></div>
                        <div class="stat-number">${analysis.sentences}</div>
                        <div class="stat-label">Sentences</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-number">${analysis.readingTime}</div>
                        <div class="stat-label">Min Read</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-graduation-cap"></i></div>
                        <div class="stat-number">${readability.grade}</div>
                        <div class="stat-label">Grade Level</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-percentage"></i></div>
                        <div class="stat-number">${readability.score}</div>
                        <div class="stat-label">Readability</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-smile"></i></div>
                        <div class="stat-number">${sentiment.score}%</div>
                        <div class="stat-label">${sentiment.label}</div>
                    </div>
                </div>
                ${this.generateSuggestions(text, analysis, sentiment, readability)}
            </div>

            <div class="tab-content" data-content="sentiment">
                <div class="sentiment-analysis">
                    <div class="sentiment-details">
                        <h4><i class="fas fa-chart-line"></i> Sentiment Analysis</h4>
                        <p><strong>Overall Sentiment:</strong> ${sentiment.label} (${sentiment.score}%)</p>
                        <p><strong>Positive Indicators:</strong> ${sentiment.positive}</p>
                        <p><strong>Negative Indicators:</strong> ${sentiment.negative}</p>
                        <p><strong>Neutral Content:</strong> ${sentiment.neutral}</p>
                        <div style="margin-top: 15px;">
                            <small style="color: var(--text-secondary);">
                                <i class="fas fa-info-circle"></i> 
                                Analysis based on linguistic patterns and emotional indicators
                            </small>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="sentimentChart-${Date.now()}"></canvas>
                    </div>
                </div>
            </div>

            <div class="tab-content" data-content="keywords">
                <h4><i class="fas fa-key"></i> Key Topics & Themes</h4>
                <div class="keyword-cloud">
                    ${keywords.map(keyword => `
                        <span class="keyword" style="font-size: ${Math.max(0.8, Math.min(1.5, keyword.weight))}rem;">
                            ${keyword.word} (${keyword.count})
                        </span>
                    `).join('')}
                </div>
                <div style="margin-top: 20px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 10px; color: white;">
                    <small><i class="fas fa-lightbulb"></i> Keywords are ranked by frequency and relevance for social media optimization</small>
                </div>
            </div>

            <div class="tab-content" data-content="platforms">
                <h4><i class="fas fa-rocket"></i> Platform Optimization</h4>
                <div class="platform-preview">
                    ${this.generatePlatformPreviews(text, analysis)}
                </div>
            </div>

            <div class="tab-content" data-content="content">
                <div class="extracted-text">
                    <strong><i class="fas fa-file-text"></i> Extracted Content:</strong><br><br>
                    ${text || 'No text could be extracted from this document.'}
                </div>
                <div class="export-options">
                    <button class="export-btn" onclick="window.analyzer.exportAsText('${filename}', \`${text.replace(/`/g, '\\`')}\`)">
                        <i class="fas fa-download"></i> Export as TXT
                    </button>
                    <button class="export-btn" onclick="window.analyzer.copyToClipboard(\`${text.replace(/`/g, '\\`')}\`)">
                        <i class="fas fa-copy"></i> Copy Text
                    </button>
                    <button class="export-btn" onclick="window.analyzer.generateReport('${filename}', ${JSON.stringify(analysis)})">
                        <i class="fas fa-chart-bar"></i> Generate Report
                    </button>
                </div>
            </div>
        `;

        container.innerHTML += resultsHTML;

        // Setup tab switching for this result
        this.setupTabSwitching(container);

        // Create sentiment chart
        setTimeout(() => {
            const chartCanvas = container.querySelector('canvas[id^="sentimentChart"]');
            if (chartCanvas) {
                this.createSentimentChart(chartCanvas, sentiment);
            }
        }, 100);
    }

    setupTabSwitching(container) {
        const tabs = container.querySelectorAll('.content-tab');
        const contents = container.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetContent = tab.dataset.content;
                
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const targetElement = container.querySelector(`[data-content="${targetContent}"]`);
                if (targetElement && targetElement.classList.contains('tab-content')) {
                    targetElement.classList.add('active');
                }
            });
        });
    }

    performAdvancedAnalysis(text) {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        const avgWordsPerSentence = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0;
        const readingTime = Math.ceil(words.length / 200); // Average reading speed

        return {
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            characters: text.length,
            avgWordsPerSentence,
            readingTime,
            complexity: this.calculateComplexity(text)
        };
    }

    analyzeSentiment(text) {
        const positiveWords = ['amazing', 'awesome', 'excellent', 'fantastic', 'great', 'wonderful', 'perfect', 'outstanding', 'superb', 'brilliant', 'love', 'best', 'incredible', 'remarkable', 'exceptional'];
        const negativeWords = ['terrible', 'awful', 'horrible', 'bad', 'worst', 'hate', 'disappointing', 'frustrating', 'annoying', 'pathetic', 'useless', 'failed', 'broken', 'wrong'];
        const neutralWords = ['okay', 'average', 'normal', 'standard', 'typical', 'regular', 'common', 'usual'];

        const words = text.toLowerCase().split(/\s+/);
        
        const positive = positiveWords.filter(word => words.includes(word)).length;
        const negative = negativeWords.filter(word => words.includes(word)).length;
        const neutral = neutralWords.filter(word => words.includes(word)).length;

        const total = positive + negative + neutral;
        const score = total > 0 ? Math.round((positive / total) * 100) : 50;
        
        let label = 'Neutral';
        if (score > 60) label = 'Positive';
        else if (score < 40) label = 'Negative';

        return { score, label, positive, negative, neutral };
    }

    extractKeywords(text) {
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'];
        
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.includes(word));

        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        return Object.entries(wordCount)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 20)
            .map(([word, count]) => ({
                word,
                count,
                weight: Math.min(2, count / Math.max(1, Math.max(...Object.values(wordCount)) / 10))
            }));
    }

    calculateReadability(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const words = text.split(/\s+/).filter(word => word.length > 0).length;
        const syllables = this.countSyllables(text);
        
        if (sentences === 0 || words === 0) return { score: 0, grade: 'N/A' };
        
        // Flesch Reading Ease Score
        const score = Math.round(206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words)));
        
        let grade = 'Graduate';
        if (score >= 90) grade = '5th';
        else if (score >= 80) grade = '6th';
        else if (score >= 70) grade = '7th';
        else if (score >= 60) grade = '8-9th';
        else if (score >= 50) grade = '10-12th';
        else if (score >= 30) grade = 'College';

        return { score: Math.max(0, score), grade };
    }

    countSyllables(text) {
        return text.toLowerCase()
            .replace(/[^a-z]/g, '')
            .replace(/e$/g, '')
            .replace(/[aeiouy]{2,}/g, 'a')
            .match(/[aeiouy]/g)?.length || 1;
    }

    calculateComplexity(text) {
        const longWords = text.split(/\s+/).filter(word => word.length > 6).length;
        const totalWords = text.split(/\s+/).length;
        return totalWords > 0 ? Math.round((longWords / totalWords) * 100) : 0;
    }

    generatePlatformPreviews(text, analysis) {
        return Object.entries(this.platformTemplates).map(([platform, config]) => {
            const truncated = text.length > config.maxChars ? 
                text.substring(0, config.maxChars - 3) + '...' : text;
            
            const suitability = this.calculatePlatformSuitability(text, platform);
            
            return `
                <div class="platform-card">
                    <div class="platform-header">
                        <i class="${config.icon}" style="color: ${config.color}; font-size: 1.5rem;"></i>
                        <div>
                            <h4>${platform.charAt(0).toUpperCase() + platform.slice(1)}</h4>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">
                                ${suitability}% suitable • ${text.length}/${config.maxChars} chars
                            </p>
                        </div>
                    </div>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-size: 0.9rem; line-height: 1.4;">
                        ${truncated}
                    </div>
                    <div style="margin-top: 10px; font-size: 0.8rem; color: var(--text-secondary);">
                        <i class="fas fa-lightbulb"></i> 
                        ${this.getPlatformTip(platform, analysis)}
                    </div>
                </div>
            `;
        }).join('');
    }

    calculatePlatformSuitability(text, platform) {
        let score = 70; // Base score
        
        const hasHashtags = (text.match(/#\w+/g) || []).length;
        const hasMentions = (text.match(/@\w+/g) || []).length;
        const hasQuestions = (text.match(/\?/g) || []).length;
        const wordCount = text.split(/\s+/).length;

        switch(platform) {
            case 'twitter':
                if (text.length <= 280) score += 20;
                if (hasHashtags > 0) score += 10;
                if (hasMentions > 0) score += 5;
                break;
            case 'instagram':
                if (hasHashtags > 5) score += 15;
                if (text.includes('📷') || text.includes('🎨')) score += 10;
                break;
            case 'linkedin':
                if (wordCount > 50) score += 15;
                if (text.includes('professional') || text.includes('business')) score += 10;
                break;
            case 'facebook':
                if (hasQuestions > 0) score += 10;
                if (wordCount > 20 && wordCount < 100) score += 15;
                break;
        }

        return Math.min(100, Math.max(0, score));
    }

    getPlatformTip(platform, analysis) {
        const tips = {
            twitter: analysis.words > 40 ? 'Consider breaking into thread for better engagement' : 'Perfect length for Twitter!',
            instagram: 'Add relevant hashtags and visual elements for better reach',
            linkedin: analysis.words < 50 ? 'Add more professional context for LinkedIn audience' : 'Great for professional networking',
            facebook: 'Ask questions to encourage comments and engagement',
            tiktok: analysis.words > 30 ? 'Keep it short and punchy for TikTok' : 'Perfect for quick TikTok captions'
        };
        return tips[platform] || 'Optimize based on platform best practices';
    }

    generateSuggestions(text, analysis, sentiment, readability) {
        const suggestions = [];
        
        if (analysis.words > 300) {
            suggestions.push({
                icon: 'fas fa-cut',
                title: 'Content Length Optimization',
                description: 'Consider breaking this into multiple posts for better digestibility and engagement',
                type: 'warning'
            });
        }

        if (analysis.words < 25) {
            suggestions.push({
                icon: 'fas fa-plus',
                title: 'Expand Your Content',
                description: 'Add more context, examples, or call-to-actions to improve engagement',
                type: 'info'
            });
        }

        if (!text.includes('#')) {
            suggestions.push({
                icon: 'fas fa-hashtag',
                title: 'Add Strategic Hashtags',
                description: 'Include 3-5 relevant hashtags to increase discoverability across platforms',
                type: 'tip'
            });
        }

        if (!text.match(/[?!]/)) {
            suggestions.push({
                icon: 'fas fa-question',
                title: 'Encourage Interaction',
                description: 'Add questions or exclamations to prompt user engagement and comments',
                type: 'tip'
            });
        }

        if (sentiment.score < 40) {
            suggestions.push({
                icon: 'fas fa-smile',
                title: 'Boost Positivity',
                description: 'Consider adding more positive language to improve audience reception',
                type: 'warning'
            });
        }

        if (readability.score < 50) {
            suggestions.push({
                icon: 'fas fa-book-open',
                title: 'Improve Readability',
                description: 'Simplify language and use shorter sentences for better comprehension',
                type: 'info'
            });
        }

        if (!text.match(/\b(comment|share|like|follow|click|visit|check out|learn more)\b/i)) {
            suggestions.push({
                icon: 'fas fa-bullhorn',
                title: 'Add Call-to-Action',
                description: 'Include clear instructions on what you want your audience to do next',
                type: 'tip'
            });
        }

        if (suggestions.length === 0) {
            suggestions.push({
                icon: 'fas fa-trophy',
                title: 'Excellent Content!',
                description: 'Your content is well-optimized for social media engagement',
                type: 'success'
            });
        }

        const typeColors = {
            success: 'var(--success)',
            warning: 'var(--warning)',
            error: 'var(--error)',
            info: 'var(--secondary-gradient)',
            tip: 'var(--purple)'
        };

        return `
            <div class="suggestions">
                <h3><i class="fas fa-magic"></i> AI-Powered Optimization Suggestions</h3>
                ${suggestions.map(s => `
                    <div class="suggestion-item" style="border-left-color: ${typeColors[s.type]};">
                        <div style="display: flex; align-items: flex-start; gap: 12px;">
                            <i class="${s.icon}" style="color: ${typeColors[s.type]}; margin-top: 2px;"></i>
                            <div>
                                <strong style="color: var(--text-primary);">${s.title}</strong><br>
                                <span style="color: var(--text-secondary); line-height: 1.5;">${s.description}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createSentimentChart(canvas, sentiment) {
        const ctx = canvas.getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Negative', 'Neutral'],
                datasets: [{
                    data: [sentiment.positive, sentiment.negative, sentiment.neutral],
                    backgroundColor: [
                        'rgba(72, 187, 120, 0.8)',
                        'rgba(229, 62, 62, 0.8)',
                        'rgba(113, 128, 150, 0.8)'
                    ],
                    borderColor: [
                        'rgba(72, 187, 120, 1)',
                        'rgba(229, 62, 62, 1)',
                        'rgba(113, 128, 150, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    exportAsText(filename, text) {
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, '') + '_extracted.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Text copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy text', 'error');
        }
    }

    generateReport(filename, analysis) {
        const reportData = {
            filename,
            timestamp: new Date().toISOString(),
            analysis,
            summary: `Comprehensive analysis of ${filename} completed with AI-powered insights.`
        };
        
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.replace(/\.[^/.]+$/, '') + '_analysis_report.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'times'}-circle"></i> ${message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Initialize the enhanced application
document.addEventListener('DOMContentLoaded', () => {
    window.analyzer = new EnhancedContentAnalyzer();
});