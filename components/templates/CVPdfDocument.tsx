import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { CVData, GeneratedContent } from '../../types';
import roboto400 from '@fontsource/roboto/files/roboto-latin-ext-400-normal.woff2?url';
import roboto700 from '@fontsource/roboto/files/roboto-latin-ext-700-normal.woff2?url';

// Register Roboto — supports Turkish + extended Latin characters
// Fonts are bundled locally via Vite for reliable PDF generation
Font.register({
  family: 'Roboto',
  fonts: [
    { src: roboto400, fontWeight: 400 },
    { src: roboto700, fontWeight: 700 },
  ],
});

Font.registerHyphenationCallback(word => [word]);

interface Props {
  data: CVData;
  content: GeneratedContent;
  watermark?: boolean;
}

// ─── MODERN TEMPLATE ────────────────────────────────────────────────
const modernStyles = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: 'Roboto', fontSize: 9, backgroundColor: '#ffffff' },
  sidebar: { width: '32%', backgroundColor: '#1e293b', color: '#ffffff', padding: 24, flexDirection: 'column', gap: 16 },
  main: { width: '68%', padding: 28, flexDirection: 'column', gap: 14 },
  name: { fontSize: 18, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: 4 },
  jobTitle: { fontSize: 10, color: '#93c5fd', marginBottom: 12 },
  sideSection: { marginBottom: 14 },
  sideSectionTitle: { fontSize: 8, fontWeight: 700, color: '#93c5fd', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 4 },
  sideText: { fontSize: 8.5, color: '#cbd5e1', marginBottom: 4, lineHeight: 1.4 },
  sideLabel: { fontSize: 7.5, color: '#64748b', marginBottom: 2 },
  skillPill: { backgroundColor: '#334155', color: '#93c5fd', fontSize: 7.5, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4, alignSelf: 'flex-start' },
  mainSection: { marginBottom: 12 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: '#1e293b', borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 4, marginBottom: 10 },
  expTitle: { fontSize: 9.5, fontWeight: 700, color: '#1e293b', marginBottom: 2 },
  expCompany: { fontSize: 8.5, color: '#3b82f6', marginBottom: 2 },
  expDate: { fontSize: 8, color: '#64748b', marginBottom: 6 },
  bullet: { flexDirection: 'row', marginBottom: 3 },
  bulletDot: { color: '#3b82f6', marginRight: 6, fontSize: 9 },
  bulletText: { fontSize: 8.5, color: '#374151', lineHeight: 1.5, flex: 1 },
  summaryText: { fontSize: 8.5, color: '#4b5563', lineHeight: 1.6 },
  watermark: { position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#9ca3af' },
  eduSchool: { fontSize: 9.5, fontWeight: 700, color: '#1e293b', marginBottom: 2 },
  eduDept: { fontSize: 8.5, color: '#4b5563', marginBottom: 2 },
  eduDate: { fontSize: 8, color: '#64748b' },
});

function ModernPDF({ data, content, watermark }: Props) {
  const p = data.personalInfo;
  const cv = content.cvContent;
  return (
    <Page size="A4" style={modernStyles.page}>
      {/* Sidebar */}
      <View style={modernStyles.sidebar}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          {p.photo
            ? <View style={{ width: 64, height: 64, borderRadius: 32, marginBottom: 8, overflow: 'hidden' }}>
                <Image src={p.photo} style={{ width: 64, height: 64 }} />
              </View>
            : <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#334155', marginBottom: 8, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#93c5fd', fontSize: 20, fontWeight: 700 }}>
                  {(p.fullName || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </Text>
              </View>
          }
          <Text style={modernStyles.name}>{p.fullName || 'Full Name'}</Text>
          <Text style={modernStyles.jobTitle}>{data.preferences.level} • {data.preferences.sector}</Text>
        </View>
        {/* Contact */}
        <View style={modernStyles.sideSection}>
          <Text style={modernStyles.sideSectionTitle}>Contact</Text>
          {p.email && <><Text style={modernStyles.sideLabel}>Email</Text><Text style={modernStyles.sideText}>{p.email}</Text></>}
          {p.phone && <><Text style={modernStyles.sideLabel}>Phone</Text><Text style={modernStyles.sideText}>{p.phone}</Text></>}
          {p.city && <><Text style={modernStyles.sideLabel}>Location</Text><Text style={modernStyles.sideText}>{p.city}{p.country ? `, ${p.country}` : ''}</Text></>}
          {p.linkedin && <><Text style={modernStyles.sideLabel}>LinkedIn</Text><Text style={modernStyles.sideText}>{p.linkedin.replace('https://', '')}</Text></>}
          {p.github && <><Text style={modernStyles.sideLabel}>GitHub</Text><Text style={modernStyles.sideText}>{p.github.replace('https://', '')}</Text></>}
        </View>
        {/* Skills */}
        {cv.skills.length > 0 && (
          <View style={modernStyles.sideSection}>
            <Text style={modernStyles.sideSectionTitle}>Skills</Text>
            {cv.skills.map((s, i) => <Text key={i} style={modernStyles.skillPill}>{s}</Text>)}
          </View>
        )}
        {/* Education in sidebar */}
        {cv.education.length > 0 && (
          <View style={modernStyles.sideSection}>
            <Text style={modernStyles.sideSectionTitle}>Education</Text>
            {cv.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={[modernStyles.sideText, { fontWeight: 700, color: '#e2e8f0' }]}>{edu.school}</Text>
                <Text style={modernStyles.sideText}>{edu.degree} — {edu.department}</Text>
                <Text style={modernStyles.sideLabel}>{edu.year}</Text>
              </View>
            ))}
          </View>
        )}
        {/* Certificates */}
        {cv.certificates.length > 0 && (
          <View style={modernStyles.sideSection}>
            <Text style={modernStyles.sideSectionTitle}>Certificates</Text>
            {cv.certificates.map((c, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={[modernStyles.sideText, { fontWeight: 700, color: '#e2e8f0' }]}>{c.name}</Text>
                <Text style={modernStyles.sideLabel}>{c.institution} • {c.year}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Main */}
      <View style={modernStyles.main}>
        {p.personalStatement && (
          <View style={modernStyles.mainSection}>
            <Text style={modernStyles.sectionTitle}>Personal Statement</Text>
            <Text style={modernStyles.summaryText}>{p.personalStatement}</Text>
          </View>
        )}
        {/* Summary */}
        {cv.summary && (
          <View style={modernStyles.mainSection}>
            <Text style={modernStyles.sectionTitle}>Summary</Text>
            <Text style={modernStyles.summaryText}>{cv.summary}</Text>
          </View>
        )}
        {/* Experience */}
        {cv.experience.length > 0 && (
          <View style={modernStyles.mainSection}>
            <Text style={modernStyles.sectionTitle}>Experience</Text>
            {cv.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <Text style={modernStyles.expTitle}>{exp.position}</Text>
                <Text style={modernStyles.expCompany}>{exp.company}</Text>
                <Text style={modernStyles.expDate}>{exp.startDate} — {exp.endDate}</Text>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={modernStyles.bullet}>
                    <Text style={modernStyles.bulletDot}>•</Text>
                    <Text style={modernStyles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
      {watermark && <Text style={modernStyles.watermark}>Generated with cvio.app</Text>}
    </Page>
  );
}

// ─── CLASSIC TEMPLATE ────────────────────────────────────────────────
const classicStyles = StyleSheet.create({
  page: { padding: 48, fontFamily: 'Roboto', fontSize: 9.5, backgroundColor: '#ffffff' },
  header: { textAlign: 'center', borderBottomWidth: 2, borderBottomColor: '#000000', paddingBottom: 16, marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 700, color: '#000000', letterSpacing: 1, marginBottom: 6 },
  contact: { fontSize: 8.5, color: '#374151', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: 8 },
  contactItem: { fontSize: 8.5, color: '#374151' },
  section: { marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontWeight: 700, color: '#000000', letterSpacing: 1.5, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#000000', paddingBottom: 4, marginBottom: 10 },
  expRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  expTitle: { fontSize: 10, fontWeight: 700, color: '#111827' },
  expDate: { fontSize: 8.5, color: '#6b7280', fontStyle: 'italic' },
  expCompany: { fontSize: 9, color: '#374151', marginBottom: 5, fontStyle: 'italic' },
  bullet: { flexDirection: 'row', marginBottom: 3 },
  bulletDot: { color: '#374151', marginRight: 8 },
  bulletText: { fontSize: 8.5, color: '#374151', lineHeight: 1.5, flex: 1 },
  summaryText: { fontSize: 9, color: '#374151', lineHeight: 1.6 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillText: { fontSize: 8.5, color: '#374151' },
  watermark: { position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#9ca3af' },
  eduRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  eduLeft: { flex: 1 },
  eduSchool: { fontSize: 10, fontWeight: 700, color: '#111827' },
  eduDept: { fontSize: 8.5, color: '#4b5563' },
  eduDate: { fontSize: 8.5, color: '#6b7280', fontStyle: 'italic' },
});

function ClassicPDF({ data, content, watermark }: Props) {
  const p = data.personalInfo;
  const cv = content.cvContent;
  const contacts = [p.email, p.phone, p.city && p.country ? `${p.city}, ${p.country}` : p.city || p.country, p.linkedin].filter(Boolean);
  return (
    <Page size="A4" style={classicStyles.page}>
      <View style={classicStyles.header}>
        <Text style={classicStyles.name}>{p.fullName || 'Full Name'}</Text>
        <View style={classicStyles.contact}>
          {contacts.map((c, i) => (
            <Text key={i} style={classicStyles.contactItem}>{c}{i < contacts.length - 1 ? ' | ' : ''}</Text>
          ))}
        </View>
      </View>

      {p.personalStatement && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Personal Statement</Text>
          <Text style={classicStyles.summaryText}>{p.personalStatement}</Text>
        </View>
      )}

      {cv.summary && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Summary</Text>
          <Text style={classicStyles.summaryText}>{cv.summary}</Text>
        </View>
      )}

      {cv.experience.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Experience</Text>
          {cv.experience.map((exp, i) => (
            <View key={i} style={{ marginBottom: 10 }}>
              <View style={classicStyles.expRow}>
                <Text style={classicStyles.expTitle}>{exp.position}</Text>
                <Text style={classicStyles.expDate}>{exp.startDate} — {exp.endDate}</Text>
              </View>
              <Text style={classicStyles.expCompany}>{exp.company}</Text>
              {exp.bullets.map((b, j) => (
                <View key={j} style={classicStyles.bullet}>
                  <Text style={classicStyles.bulletDot}>•</Text>
                  <Text style={classicStyles.bulletText}>{b}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {cv.education.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Education</Text>
          {cv.education.map((edu, i) => (
            <View key={i} style={classicStyles.eduRow}>
              <View style={classicStyles.eduLeft}>
                <Text style={classicStyles.eduSchool}>{edu.school}</Text>
                <Text style={classicStyles.eduDept}>{edu.degree} — {edu.department}</Text>
              </View>
              <Text style={classicStyles.eduDate}>{edu.year}</Text>
            </View>
          ))}
        </View>
      )}

      {cv.skills.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Skills</Text>
          <View style={classicStyles.skillsRow}>
            {cv.skills.map((s, i) => (
              <Text key={i} style={classicStyles.skillText}>{s}{i < cv.skills.length - 1 ? ' •' : ''}</Text>
            ))}
          </View>
        </View>
      )}

      {cv.certificates.length > 0 && (
        <View style={classicStyles.section}>
          <Text style={classicStyles.sectionTitle}>Certificates</Text>
          {cv.certificates.map((c, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <View>
                <Text style={{ fontSize: 9, fontWeight: 700, color: '#111827' }}>{c.name}</Text>
                <Text style={{ fontSize: 8.5, color: '#4b5563' }}>{c.institution}</Text>
              </View>
              <Text style={{ fontSize: 8.5, color: '#6b7280' }}>{c.year}</Text>
            </View>
          ))}
        </View>
      )}

      {watermark && <Text style={classicStyles.watermark}>Generated with cvio.app</Text>}
    </Page>
  );
}

// ─── MINIMAL TEMPLATE ────────────────────────────────────────────────
const minimalStyles = StyleSheet.create({
  page: { padding: 52, fontFamily: 'Roboto', fontSize: 9, backgroundColor: '#ffffff' },
  name: { fontSize: 24, fontWeight: 700, color: '#111827', marginBottom: 6 },
  tagline: { fontSize: 9, color: '#6b7280', marginBottom: 4 },
  contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 28 },
  contactItem: { fontSize: 8, color: '#9ca3af' },
  row: { flexDirection: 'row', marginBottom: 14 },
  leftCol: { width: '28%', paddingRight: 16 },
  rightCol: { width: '72%' },
  sectionLabel: { fontSize: 7.5, fontWeight: 700, color: '#9ca3af', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 },
  divider: { borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb', marginBottom: 14 },
  expTitle: { fontSize: 9.5, fontWeight: 700, color: '#111827', marginBottom: 2 },
  expCompany: { fontSize: 8.5, color: '#374151', marginBottom: 2 },
  expDate: { fontSize: 8, color: '#9ca3af', marginBottom: 6 },
  bullet: { flexDirection: 'row', marginBottom: 3 },
  bulletBar: { width: 2, backgroundColor: '#e5e7eb', marginRight: 8, borderRadius: 1 },
  bulletText: { fontSize: 8.5, color: '#4b5563', lineHeight: 1.5, flex: 1 },
  summaryText: { fontSize: 9, color: '#4b5563', lineHeight: 1.6 },
  skillPill: { backgroundColor: '#f3f4f6', color: '#374151', fontSize: 8, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, marginBottom: 4, marginRight: 4, alignSelf: 'flex-start' },
  skillsWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  watermark: { position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#9ca3af' },
});

function MinimalPDF({ data, content, watermark }: Props) {
  const p = data.personalInfo;
  const cv = content.cvContent;
  const contacts = [p.email, p.phone, p.city && p.country ? `${p.city}, ${p.country}` : (p.city || p.country)].filter(Boolean) as string[];
  return (
    <Page size="A4" style={minimalStyles.page}>
      <Text style={minimalStyles.name}>{p.fullName || 'Full Name'}</Text>
      <View style={minimalStyles.contactRow}>
        {contacts.map((c, i) => <Text key={i} style={minimalStyles.contactItem}>{c}</Text>)}
      </View>
      <View style={minimalStyles.divider} />

      {p.personalStatement && (
        <View style={minimalStyles.row}>
          <View style={minimalStyles.leftCol}><Text style={minimalStyles.sectionLabel}>Personal Statement</Text></View>
          <View style={minimalStyles.rightCol}><Text style={minimalStyles.summaryText}>{p.personalStatement}</Text></View>
        </View>
      )}

      {cv.summary && (
        <View style={minimalStyles.row}>
          <View style={minimalStyles.leftCol}><Text style={minimalStyles.sectionLabel}>Summary</Text></View>
          <View style={minimalStyles.rightCol}><Text style={minimalStyles.summaryText}>{cv.summary}</Text></View>
        </View>
      )}

      {cv.experience.length > 0 && (
        <View>
          {cv.experience.map((exp, i) => (
            <View key={i} style={minimalStyles.row}>
              <View style={minimalStyles.leftCol}>
                <Text style={minimalStyles.sectionLabel}>{i === 0 ? 'Experience' : ''}</Text>
                <Text style={[minimalStyles.contactItem, { marginTop: i === 0 ? 4 : 0 }]}>{exp.startDate}</Text>
                <Text style={minimalStyles.contactItem}>— {exp.endDate}</Text>
              </View>
              <View style={minimalStyles.rightCol}>
                <Text style={minimalStyles.expTitle}>{exp.position}</Text>
                <Text style={minimalStyles.expCompany}>{exp.company}</Text>
                {exp.bullets.map((b, j) => (
                  <View key={j} style={minimalStyles.bullet}>
                    <Text style={{ color: '#d1d5db', marginRight: 8, fontSize: 9 }}>—</Text>
                    <Text style={minimalStyles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      {cv.education.length > 0 && (
        <View style={minimalStyles.row}>
          <View style={minimalStyles.leftCol}><Text style={minimalStyles.sectionLabel}>Education</Text></View>
          <View style={minimalStyles.rightCol}>
            {cv.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={minimalStyles.expTitle}>{edu.school}</Text>
                <Text style={minimalStyles.expCompany}>{edu.degree} — {edu.department}</Text>
                <Text style={minimalStyles.expDate}>{edu.year}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {cv.skills.length > 0 && (
        <View style={minimalStyles.row}>
          <View style={minimalStyles.leftCol}><Text style={minimalStyles.sectionLabel}>Skills</Text></View>
          <View style={[minimalStyles.rightCol, minimalStyles.skillsWrap]}>
            {cv.skills.map((s, i) => <Text key={i} style={minimalStyles.skillPill}>{s}</Text>)}
          </View>
        </View>
      )}

      {watermark && <Text style={minimalStyles.watermark}>Generated with cvio.app</Text>}
    </Page>
  );
}

// ─── PROFESSIONAL TEMPLATE ────────────────────────────────────────────────
const professionalStyles = StyleSheet.create({
  page: { fontFamily: 'Roboto', fontSize: 9, backgroundColor: '#ffffff' },
  header: { backgroundColor: '#0f172a', padding: 32, flexDirection: 'row', alignItems: 'center', gap: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#1e40af', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#ffffff', fontSize: 20, fontWeight: 700 },
  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 4 },
  headerTitle: { fontSize: 10, color: '#93c5fd', marginBottom: 8 },
  headerContacts: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  headerContact: { fontSize: 8, color: '#94a3b8' },
  body: { flexDirection: 'row', padding: 24, gap: 20 },
  leftCol: { width: '35%', gap: 16 },
  rightCol: { width: '65%', gap: 14 },
  card: { backgroundColor: '#f8fafc', borderRadius: 8, padding: 14, borderLeftWidth: 3, borderLeftColor: '#3b82f6' },
  sectionTitle: { fontSize: 9, fontWeight: 700, color: '#1e293b', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  skillItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  skillDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#3b82f6', marginRight: 8 },
  skillText: { fontSize: 8.5, color: '#374151' },
  mainSectionTitle: { fontSize: 11, fontWeight: 700, color: '#0f172a', borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 4, marginBottom: 10 },
  expTitle: { fontSize: 10, fontWeight: 700, color: '#0f172a', marginBottom: 2 },
  expCompany: { fontSize: 9, color: '#3b82f6', marginBottom: 2 },
  expDate: { fontSize: 8, color: '#64748b', marginBottom: 6 },
  bullet: { flexDirection: 'row', marginBottom: 3 },
  bulletDot: { color: '#3b82f6', marginRight: 6 },
  bulletText: { fontSize: 8.5, color: '#374151', lineHeight: 1.5, flex: 1 },
  summaryText: { fontSize: 8.5, color: '#4b5563', lineHeight: 1.6 },
  watermark: { position: 'absolute', bottom: 10, left: 0, right: 0, textAlign: 'center', fontSize: 8, color: '#9ca3af' },
});

function ProfessionalPDF({ data, content, watermark }: Props) {
  const p = data.personalInfo;
  const cv = content.cvContent;
  const initials = p.fullName ? p.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'AD';
  const contacts = [p.email, p.phone, p.city && p.country ? `${p.city}, ${p.country}` : (p.city || p.country), p.linkedin].filter(Boolean) as string[];
  return (
    <Page size="A4" style={professionalStyles.page}>
      {/* Header */}
      <View style={professionalStyles.header}>
        {p.photo
          ? <View style={{ width: 56, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
              <Image src={p.photo} style={{ width: 56, height: 56 }} />
            </View>
          : <View style={professionalStyles.avatar}>
              <Text style={professionalStyles.avatarText}>{initials}</Text>
            </View>
        }
        <View style={professionalStyles.headerInfo}>
          <Text style={professionalStyles.name}>{p.fullName || 'Full Name'}</Text>
          <Text style={professionalStyles.headerTitle}>{data.preferences.level} • {data.preferences.sector}</Text>
          <View style={professionalStyles.headerContacts}>
            {contacts.map((c, i) => <Text key={i} style={professionalStyles.headerContact}>{c}</Text>)}
          </View>
        </View>
      </View>

      {/* Body */}
      <View style={professionalStyles.body}>
        {/* Left */}
        <View style={professionalStyles.leftCol}>
          {cv.skills.length > 0 && (
            <View style={professionalStyles.card}>
              <Text style={professionalStyles.sectionTitle}>Skills</Text>
              {cv.skills.map((s, i) => (
                <View key={i} style={professionalStyles.skillItem}>
                  <View style={professionalStyles.skillDot} />
                  <Text style={professionalStyles.skillText}>{s}</Text>
                </View>
              ))}
            </View>
          )}
          {cv.education.length > 0 && (
            <View style={professionalStyles.card}>
              <Text style={professionalStyles.sectionTitle}>Education</Text>
              {cv.education.map((edu, i) => (
                <View key={i} style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 9, fontWeight: 700, color: '#0f172a' }}>{edu.school}</Text>
                  <Text style={{ fontSize: 8.5, color: '#4b5563' }}>{edu.degree}</Text>
                  <Text style={{ fontSize: 8.5, color: '#4b5563' }}>{edu.department}</Text>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>{edu.year}</Text>
                </View>
              ))}
            </View>
          )}
          {cv.certificates.length > 0 && (
            <View style={professionalStyles.card}>
              <Text style={professionalStyles.sectionTitle}>Certificates</Text>
              {cv.certificates.map((c, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={{ fontSize: 9, fontWeight: 700, color: '#0f172a' }}>{c.name}</Text>
                  <Text style={{ fontSize: 8, color: '#64748b' }}>{c.institution} • {c.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Right */}
        <View style={professionalStyles.rightCol}>
          {p.personalStatement && (
            <View style={{ marginBottom: 14 }}>
              <Text style={professionalStyles.mainSectionTitle}>Personal Statement</Text>
              <Text style={professionalStyles.summaryText}>{p.personalStatement}</Text>
            </View>
          )}
          {cv.summary && (
            <View style={{ marginBottom: 14 }}>
              <Text style={professionalStyles.mainSectionTitle}>Summary</Text>
              <Text style={professionalStyles.summaryText}>{cv.summary}</Text>
            </View>
          )}
          {cv.experience.length > 0 && (
            <View>
              <Text style={professionalStyles.mainSectionTitle}>Experience</Text>
              {cv.experience.map((exp, i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <Text style={professionalStyles.expTitle}>{exp.position}</Text>
                  <Text style={professionalStyles.expCompany}>{exp.company}</Text>
                  <Text style={professionalStyles.expDate}>{exp.startDate} — {exp.endDate}</Text>
                  {exp.bullets.map((b, j) => (
                    <View key={j} style={professionalStyles.bullet}>
                      <Text style={professionalStyles.bulletDot}>•</Text>
                      <Text style={professionalStyles.bulletText}>{b}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
      {watermark && <Text style={professionalStyles.watermark}>Generated with cvio.app</Text>}
    </Page>
  );
}


// ─── MAIN EXPORT ────────────────────────────────────────────────────────
export function CVPdfDocument({ data, content, watermark = false }: Props) {
  const template = data.preferences.template;
  return (
    <Document title={`CV — ${data.personalInfo.fullName}`} author={data.personalInfo.fullName} subject="Curriculum Vitae" creator="cvio.app">
      {template === 'classic'      && <ClassicPDF      data={data} content={content} watermark={watermark} />}
      {template === 'professional' && <ProfessionalPDF data={data} content={content} watermark={watermark} />}
      {(template === 'modern' || !template || (template !== 'classic' && template !== 'professional')) && (
        <ModernPDF data={data} content={content} watermark={watermark} />
      )}
    </Document>
  );
}

