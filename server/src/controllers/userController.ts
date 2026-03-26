import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { createError } from '../middleware/errorHandler';
import User from '../models/User';

export const getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) return next(createError('User not found', 404));
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error) { next(error); }
};

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, bio, avatar } = req.body;
    const updateFields: { username?: string; bio?: string; avatar?: string } = {};
    if (username !== undefined) updateFields.username = username;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar !== undefined) updateFields.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!user) return next(createError('User not found', 404));
    res.json({
      success: true,
      data: { id: user.id, username: user.username, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio },
    });
  } catch (error) { next(error); }
};

export const deleteAccount = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.user?.id);
    if (!user) return next(createError('User not found', 404));
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) { next(error); }
};

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return next(createError('Current password and new password are required', 400));

    const user = await User.findById(req.user?.id).select('+password');
    if (!user) return next(createError('User not found', 404));
    if (!(await user.comparePassword(currentPassword))) return next(createError('Current password is incorrect', 401));

    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) { next(error); }
};

export const uploadAvatar = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl) return next(createError('Avatar URL is required', 400));
    try {
      const url = new URL(avatarUrl);
      if (url.protocol !== 'https:') return next(createError('Avatar URL must use HTTPS', 400));
    } catch {
      return next(createError('Invalid avatar URL format', 400));
    }
    const user = await User.findByIdAndUpdate(
      req.user?.id,
      { $set: { avatar: avatarUrl } },
      { new: true }
    );
    if (!user) return next(createError('User not found', 404));
    res.json({ success: true, data: { avatar: user.avatar } });
  } catch (error) { next(error); }
};
