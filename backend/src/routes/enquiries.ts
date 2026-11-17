import { Router, Request, Response, NextFunction } from 'express';
import { enquiries } from '../config/database';
import { validateRequest, enquiryValidators } from '../middleware/validators';
import { sendWhatsAppMessage } from '../services/greenapi';

const router = Router();

// Create a customer enquiry (quote request) and notify WhatsApp
router.post('/', validateRequest(enquiryValidators), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, email, city, budget, service, message } = req.body;

    const newEnquiry = await enquiries.create({
      name,
      phone,
      email: email || null,
      city: city || null,
      budget: budget || null,
      service: service || null,
      message: message || null,
      status: 'New',
    });

    // Push the enquiry to WhatsApp via GREEN-API.
    // Non-blocking: a failure here never fails the enquiry itself.
    try {
      const lines: string[] = [];
      lines.push('🧑 *New Website Enquiry — Smart Choice*');
      lines.push(`Name: *${name}*`);
      lines.push(`Phone: *${phone}*`);
      if (email) lines.push(`Email: ${email}`);
      if (city) lines.push(`Location: ${city}`);
      if (service) lines.push(`Service: ${service}`);
      if (budget) lines.push(`Budget: ${budget}`);
      if (message) lines.push('', `📝 Message:`, message);

      await sendWhatsAppMessage(lines.join('\n'));
    } catch (notifyErr) {
      console.error('[enquiries] WhatsApp notification failed:', (notifyErr as Error)?.message || notifyErr);
    }

    res.status(201).json({
      success: true,
      data: newEnquiry,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
