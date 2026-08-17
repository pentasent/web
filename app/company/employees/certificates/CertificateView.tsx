'use client';

import { useState, useEffect, useRef } from 'react';
import { 
    Download, 
    Copy, 
    AlertTriangle, 
    ShieldCheck, 
    Calendar, 
    Briefcase, 
    Building2,
    Check,
    MapPin,
    Mail,
    Maximize2,
    X
} from 'lucide-react';
import Link from 'next/link';
import { toPng } from 'html-to-image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';

interface CertificateData {
    id: string;
    certificate_id: string;
    certificate_number: string;
    status: 'draft' | 'issued' | 'revoked';
    employee_id: string | null;
    employee_name: string;
    designation: string;
    role_type: string;
    department: string;
    certificate_type: string;
    certificate_title: string;
    certificate_description: string;
    purpose: string;
    start_date: string;
    end_date: string;
    issued_at: string;
    responsible_person_name: string;
    responsible_person_designation: string;
    organization_name: string;
    organization_address: string;
    organization_email: string;
    verification_code: string;
    verification_url: string;
    revoked_at?: string | null;
    revocation_reason?: string | null;
    metadata: {
        programme?: string;
        duration?: string;
        teams?: string[];
        [key: string]: any;
    };
    created_at: string;
    updated_at: string;
}

interface CertificateViewProps {
    certificate: CertificateData | null;
    certificateId: string;
}

export default function CertificateView({ certificate, certificateId }: CertificateViewProps) {
    const [copied, setCopied] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    // Scale factors for preview and fullscreen views
    const [scale, setScale] = useState(1);
    const [modalScale, setModalScale] = useState(1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const modalContainerRef = useRef<HTMLDivElement>(null);

    // Responsive scaling for the main page preview
    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            const parentWidth = containerRef.current.clientWidth;
            const targetWidth = 900; // Fixed size of certificate template
            if (parentWidth < targetWidth) {
                setScale(parentWidth / targetWidth);
            } else {
                setScale(1);
            }
        };

        handleResize();
        const timer = setTimeout(handleResize, 100);
        window.addEventListener('resize', handleResize);
        
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, [certificate]);

    // Responsive scaling for the fullscreen modal viewer
    useEffect(() => {
        if (!isFullscreen) return;
        
        const handleModalResize = () => {
            if (!modalContainerRef.current) return;
            const parentWidth = modalContainerRef.current.clientWidth - 48;
            const parentHeight = modalContainerRef.current.clientHeight - 130;
            const targetWidth = 900;
            const targetHeight = 636;
            
            const scaleW = parentWidth / targetWidth;
            const scaleH = parentHeight / targetHeight;
            
            setModalScale(Math.min(scaleW, scaleH, 1));
        };

        handleModalResize();
        const timer = setTimeout(handleModalResize, 150);
        window.addEventListener('resize', handleModalResize);
        
        return () => {
            window.removeEventListener('resize', handleModalResize);
            clearTimeout(timer);
        };
    }, [isFullscreen]);

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDownloadPng = async () => {
        const node = document.getElementById('pentasent-certificate-print');
        if (!node) return;

        setDownloading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 300));

            const dataUrl = await toPng(node, {
                quality: 1,
                pixelRatio: 3,
                width: 900,
                height: 636
            });

            const link = document.createElement('a');
            link.download = `${certificate?.employee_name.replace(/\s+/g, '_')}_Pentasent_Certificate.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error generating certificate image:', err);
        } finally {
            setDownloading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchId.trim()) {
            window.location.href = `/company/employees/certificates?id=${searchId.trim()}`;
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    // Error / No Record Found State
    if (!certificate || certificate.status === 'revoked') {
        const isRevoked = certificate?.status === 'revoked';
        return (
            <div className="w-full max-w-4xl mx-auto px-4 py-16 md:py-24">
                <div className="flex justify-center mb-12">
                    <Link href="/" className="text-3xl font-light tracking-wide text-[#3d253b]" style={{ fontFamily: 'Georgia, serif' }}>
                        Pentasent
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                    <Card className="md:col-span-2 border border-gray-200 shadow-none rounded-lg bg-white/80 backdrop-blur-md">
                        <CardContent className="p-8 text-center space-y-6">
                            <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-light text-[#3c2a34]" style={{ fontFamily: 'Georgia, serif' }}>
                                    {isRevoked ? 'Certificate Revoked' : 'Verification Failed'}
                                </h2>
                                <p className="text-gray-600 max-w-md mx-auto text-sm leading-relaxed">
                                    {isRevoked 
                                        ? `The certificate with ID ${certificateId} has been revoked by Pentasent. Reason: ${certificate.revocation_reason || 'N/A'}`
                                        : `We could not find any active employee or internship record matching the Certificate ID: "${certificateId}".`
                                    }
                                </p>
                            </div>

                            <hr className="border-gray-100" />

                            <div className="text-left space-y-3 text-sm text-gray-500">
                                <h4 className="font-semibold text-gray-700">Why am I seeing this?</h4>
                                <ul className="list-disc pl-5 space-y-1.5">
                                    <li>The verification URL might contain a typo.</li>
                                    <li>The certificate is outdated, suspended, or was never issued.</li>
                                    <li>For direct verification support, contact us at <span className="font-semibold text-[#3d253b]">careers@pentasent.com</span>.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border border-gray-200 shadow-none rounded-lg bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-medium text-[#3c2a34]" style={{ fontFamily: 'Georgia, serif' }}>Verify Another</h3>
                            <p className="text-xs text-gray-500">
                                Enter a valid Pentasent certificate ID below to query the database.
                            </p>
                            <form onSubmit={handleSearch} className="space-y-3">
                                <div className="space-y-1">
                                    <Label htmlFor="search-id" className="sr-only">Certificate ID</Label>
                                    <Input 
                                        id="search-id"
                                        placeholder="e.g. PEN-CERT-8X7K2M"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        className="h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-[#3d253b]"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-[#3d253b] hover:bg-[#2d1a2b] text-white text-xs h-10 rounded-md">
                                    Verify Record
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Shared internal structure for Certificate details, ensuring absolute layout scale consistency
    const certificateContent = (
        <>
            {/* Inner thin border */}
            <div className="absolute inset-4 border border-[#3d253b]/20 pointer-events-none"></div>
            
            {/* Top Header */}
            <div className="flex justify-between items-center z-10 w-full">
                {/* Left Side: Brand Text & Motto */}
                <div className="text-left">
                    <div className="text-2xl font-semibold tracking-wider text-[#3d253b] font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                        Pentasent
                    </div>
                    <div className="text-[10px] tracking-wide text-gray-400 mt-1">
                        For People Who Say “I’m Fine” But Aren’t
                    </div>
                </div>
                
                {/* Right Side: Shifted & Rounded Logo */}
                <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200/80 shadow-sm bg-white flex items-center justify-center">
                    <Image 
                        src="/icon.png" 
                        alt="Pentasent Logo" 
                        className="w-10 h-10 object-contain rounded-full"
                        width={40}
                        height={40}
                    />
                </div>
            </div>

            {/* Main Certificate Details */}
            <div className="space-y-4 my-auto z-10 w-full">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#3d253b]/60">
                        {certificate.certificate_type.replace(/_/g, ' ')}
                    </span>
                    <h2 className="text-3xl font-light text-[#3d253b] font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                        {certificate.certificate_title}
                    </h2>
                </div>

                <div className="w-16 h-[1px] bg-[#3d253b]/30 mx-auto my-3"></div>

                <p className="text-xs text-gray-400 italic">This is proudly presented to</p>
                
                <h3 className="text-4xl font-normal text-[#3d253b] tracking-wide py-2 font-serif" style={{ fontFamily: 'Georgia, serif' }}>
                    {certificate.employee_name}
                </h3>

                <p className="text-xs text-gray-600 max-w-xl mx-auto leading-relaxed px-4">
                    {certificate.certificate_description}
                </p>
            </div>

            {/* Footer & Signatures */}
            <div className="grid grid-cols-3 items-end z-10 text-left pt-6 w-full">
                
                {/* Authorized Person Signature */}
                <div className="space-y-1">
                    <div className="font-serif italic text-base text-[#3d253b]/80 pl-2">
                        {certificate.responsible_person_name}
                    </div>
                    <div className="h-[1px] bg-gray-300 w-full max-w-[150px]"></div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-400 pl-1">
                        {certificate.responsible_person_designation}, Pentasent
                    </div>
                </div>

                {/* Date & Organization info */}
                <div className="text-center space-y-1">
                    <div className="text-[10px] font-medium text-gray-700">
                        {formatDate(certificate.issued_at)}
                    </div>
                    <div className="h-[1px] bg-gray-300 w-full max-w-[100px] mx-auto"></div>
                    <div className="text-[9px] uppercase tracking-wider text-gray-400">
                        Date of Issue
                    </div>
                </div>

                {/* Verification metadata details */}
                <div className="text-right space-y-1 font-mono text-[8px] text-gray-400">
                    <div>Certificate ID: {certificate.certificate_id}</div>
                    <div>Number: {certificate.certificate_number}</div>
                </div>
            </div>
        </>
    );

    const hasMetadata = Object.keys(certificate.metadata).length > 0;

    return (
        <div className="w-full max-w-6xl mx-auto px-4 py-10 space-y-8">
            
            {/* Minimal Logo Header */}
            <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-light tracking-wide text-[#3d253b]" style={{ fontFamily: 'Georgia, serif' }}>
                    Pentasent
                </Link>
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-800 px-3 py-1.5 rounded-full text-xs font-medium">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span>Verified Official Record</span>
                </div>
            </div>

            {/* Top Section: Side-by-Side (Certificate Preview & Verification Summary) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column: Scaled-down certificate container */}
                <div className="lg:col-span-8">
                    <div className="w-full bg-black/5 p-4 rounded-xl border border-gray-200/50 backdrop-blur-sm relative">
                        {/* Interactive overlay button to expand/view full page */}
                        <button 
                            onClick={() => setIsFullscreen(true)}
                            className="absolute top-8 right-8 z-20 bg-white/90 hover:bg-white text-gray-700 hover:text-black p-2 rounded-full shadow-md border border-gray-200/50 transition-all flex items-center gap-1.5 text-xs font-medium"
                            title="View Fullscreen"
                        >
                            <Maximize2 className="w-4 h-4" />
                            <span className="hidden sm:inline">View Fullscreen</span>
                        </button>

                        <div 
                            ref={containerRef} 
                            className="w-full flex justify-center overflow-hidden rounded-md"
                            style={{ height: `${636 * scale}px` }}
                        >
                            <div 
                                style={{ 
                                    width: '900px', 
                                    height: '636px', 
                                    transform: `scale(${scale})`, 
                                    transformOrigin: 'top center',
                                }}
                                className="bg-[#fffdfb] border-[16px] border-[#3d253b] relative p-12 text-center flex flex-col justify-between font-sans shadow-lg shrink-0"
                            >
                                {certificateContent}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Verification Summary */}
                <div className="lg:col-span-4 space-y-4">
                    <Card className="border border-gray-200 shadow-none rounded-lg bg-white/90 backdrop-blur-sm">
                        <CardContent className="p-6 space-y-4">
                            <h3 className="text-lg font-medium text-[#3c2a34]" style={{ fontFamily: 'Georgia, serif' }}>Verification Summary</h3>
                            
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Recipient</span>
                                    <span className="font-medium text-[#3c2a34]">{certificate.employee_name}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Designation</span>
                                    <span className="font-medium text-[#3c2a34]">{certificate.designation}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Department</span>
                                    <span className="font-medium text-[#3c2a34]">{certificate.department}</span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Period</span>
                                    <span className="font-medium text-[#3c2a34] text-xs">
                                        {formatDate(certificate.start_date)} - {formatDate(certificate.end_date)}
                                    </span>
                                </div>
                                <div className="flex justify-between py-2 border-b border-gray-100">
                                    <span className="text-gray-500">Certificate Number</span>
                                    <span className="font-mono text-xs text-[#3c2a34]">{certificate.certificate_number}</span>
                                </div>
                            </div>

                            <div className="space-y-2 pt-2">
                                <Button 
                                    onClick={handleDownloadPng} 
                                    disabled={downloading}
                                    className="w-full bg-[#3d253b] hover:bg-[#2d1a2b] text-white text-xs h-11 rounded-md flex items-center justify-center gap-2"
                                >
                                    {downloading ? (
                                        <>Generating PNG...</>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Download Certificate
                                        </>
                                    )}
                                </Button>
                                <Button 
                                    onClick={handleCopyLink} 
                                    variant="outline"
                                    className="w-full border-gray-200 hover:bg-gray-50 text-xs h-11 rounded-md flex items-center justify-center gap-2"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-600" />
                                            Link Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy Verification Link
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Shifted Tip Text */}
                    <div className="bg-gray-50 border border-gray-100 p-3.5 rounded-lg text-xs text-gray-500">
                        <span>Tip: Use the &quot;View Fullscreen&quot; option to preview it in high resolution.</span>
                    </div>
                </div>

            </div>

            {/* Bottom Section: Program Details & Issuing Authority Side-by-Side */}
            <div className={`grid grid-cols-1 ${hasMetadata ? 'md:grid-cols-2' : ''} gap-6 mt-8`}>
                
                {/* Program Details Card */}
                {hasMetadata && (
                    <Card className="border border-gray-200 shadow-none rounded-lg bg-white/90 backdrop-blur-sm h-full">
                        <CardContent className="p-6 space-y-4">
                            <h4 className="text-sm font-medium text-[#3c2a34] border-b border-gray-100 pb-2">Program Details</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                {certificate.metadata.programme && (
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Programme</span>
                                        <span className="font-medium text-[#3c2a34]">{certificate.metadata.programme}</span>
                                    </div>
                                )}
                                {certificate.metadata.duration && (
                                    <div>
                                        <span className="text-gray-400 block mb-0.5">Duration</span>
                                        <span className="font-medium text-[#3c2a34]">{certificate.metadata.duration}</span>
                                    </div>
                                )}
                                {certificate.metadata.teams && (
                                    <div className="sm:col-span-2">
                                        <span className="text-gray-400 block mb-1">Teams Involved</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {certificate.metadata.teams.map((t: string) => (
                                                <span key={t} className="bg-[#3d253b]/5 text-[#3d253b] px-2 py-0.5 rounded text-[10px] font-medium">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Issuing Authority Card */}
                <Card className={`border border-gray-200 shadow-none rounded-lg bg-white/90 backdrop-blur-sm h-full ${!hasMetadata ? 'max-w-xl mx-auto w-full' : ''}`}>
                    <CardContent className="p-6 space-y-4">
                        <h4 className="text-sm font-medium text-[#3c2a34] border-b border-gray-100 pb-2">Issuing Authority</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-600">
                            <div className="flex items-start gap-2.5">
                                <Building2 className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-[#3c2a34]">{certificate.organization_name}</p>
                                    <p className="text-[10px] text-gray-400">For People Who Say &quot;I&apos;m Fine&quot; But Aren&apos;t</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <MapPin className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                                <span>{certificate.organization_address}</span>
                            </div>
                            <div className="flex items-start gap-2.5 sm:col-span-2">
                                <Mail className="w-4.5 h-4.5 text-gray-400 shrink-0 mt-0.5" />
                                <span>{certificate.organization_email}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            </div>

            {/* Hidden pixel-perfect certificate template used strictly for high-resolution PNG export */}
            <div className="absolute left-[-9999px] top-[-9999px] pointer-events-none">
                <div 
                    id="pentasent-certificate-print"
                    style={{ 
                        width: '900px', 
                        height: '636px', 
                    }}
                    className="bg-[#fffdfb] border-[16px] border-[#3d253b] relative p-12 text-center flex flex-col justify-between font-sans shrink-0"
                >
                    {certificateContent}
                </div>
            </div>

            {/* Fullscreen Overlay Viewer Modal */}
            {isFullscreen && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-center items-center p-4">
                    
                    {/* Control Panel Header */}
                    <div className="w-full max-w-4xl flex justify-between items-center mb-6 text-white shrink-0">
                        <div>
                            <h3 className="font-medium font-serif text-lg">{certificate.employee_name}&apos;s Certificate</h3>
                            <p className="text-xs text-gray-400">Resolution Optimized View</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button 
                                onClick={handleDownloadPng} 
                                disabled={downloading}
                                className="bg-white hover:bg-gray-100 text-[#3d253b] text-xs h-10 px-4 rounded-md flex items-center gap-2"
                            >
                                <Download className="w-4.5 h-4.5" />
                                Download PNG
                            </Button>
                            <button 
                                onClick={() => setIsFullscreen(false)}
                                className="text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Modal container to hold and scale the fullscreen view */}
                    <div 
                        ref={modalContainerRef}
                        className="w-full h-full max-w-4xl max-h-[85vh] flex justify-center items-center overflow-hidden"
                    >
                        <div 
                            style={{ 
                                width: '900px', 
                                height: '636px', 
                                transform: `scale(${modalScale})`, 
                                transformOrigin: 'center center',
                            }}
                            className="bg-[#fffdfb] border-[16px] border-[#3d253b] relative p-12 text-center flex flex-col justify-between font-sans shadow-2xl shrink-0 animate-in zoom-in-95 duration-200"
                        >
                            {certificateContent}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
