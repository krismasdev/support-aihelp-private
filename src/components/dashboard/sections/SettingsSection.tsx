import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { User, Bell, Shield, HelpCircle } from 'lucide-react';
import { getPronounDisplay } from '@/utils/pronouns';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppDispatch';
import { selectUserProfile, selectUserLoading, updateProfile } from '@/store/userSlice';
import { useToast } from '@/hooks/use-toast';

export const SettingsSection = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector(selectUserProfile);
  const isProfileLoading = useAppSelector(selectUserLoading);
  const [avatarPreview, setAvatarPreview] = useState(userProfile.avatar_url);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [name, setName] = useState(userProfile.name);
  const [age, setAge] = useState(userProfile.age?.toString() || '');
  const [pronouns, setPronouns] = useState(userProfile.pronouns || '1');
  const [helperType, setHelperType] = useState(userProfile.helper_type || 'friend');
  const [preferredTone, setPreferredTone] = useState(userProfile.preferred_tone || 'gentle');
  const [isLoading, setIsLoading] = useState(false);
  const [isPrefLoading, setIsPrefLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Update local state when Redux state changes

  // Update local state when Redux state changes
  useEffect(() => {
    setAvatarPreview(userProfile.avatar_url);
    setName(userProfile.name);
    setAge(userProfile.age?.toString() || '');
    setPronouns(userProfile.pronouns || '1');
    setHelperType(userProfile.helper_type || 'friend');
    setPreferredTone(userProfile.preferred_tone || 'gentle');
  }, [userProfile]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangeAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      if (!userProfile.id) {
        throw new Error('User not authenticated');
      }

      let avatarUrl = userProfile.avatar_url;
      
      // Upload avatar if a new file was selected
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${userProfile.id}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, selectedFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
        
        avatarUrl = publicUrl;
      }

      // Update profile via edge function
      const { data, error } = await supabase.functions.invoke('update-profile', {
        body: {
          userId: userProfile.id,
          name,
          age: parseInt(age) || null,
          pronouns,
          avatarUrl
        }
      });

      if (error) {
        throw error;
      }

      // Update Redux store with the new profile data
      dispatch(updateProfile({
        name,
        age: parseInt(age) || null,
        pronouns,
        avatar_url: avatarUrl
      }));

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePreferences = async () => {
    setIsPrefLoading(true);
    try {
      if (!userProfile.id) {
        throw new Error('User not authenticated');
      }
      const { data, error } = await supabase.functions.invoke('update-preferences', {
        body: {
          userId: userProfile.id,
          helper_type: helperType,
          preferred_tone: preferredTone,
        },
      });
      if (error) throw error;
      
      // Update Redux store with the new preferences
      dispatch(updateProfile({
        helper_type: helperType,
        preferred_tone: preferredTone,
      }));
      
      toast({
        title: "Success",
        description: "Preferences updated successfully!",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Error", 
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPrefLoading(false);
    }
  };

  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const isDeleteEnabled = deleteConfirmText === 'DELETE My Account';

  const handleDeleteAccount = async () => {
    try {
      if (!userProfile.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('delete-account', {
        body: {
          userId: userProfile.id
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Account deleted successfully. Redirecting...",
      });
      
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, 2000);
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again or contact support.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-indigo-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your preferences and account.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="text-indigo-600" size={20} />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-16 h-16">
                {avatarPreview ? (
                  <AvatarImage src={avatarPreview} alt="Avatar preview" />
                ) : (
                  <AvatarFallback className="bg-indigo-100 text-indigo-900 text-xl">
                    {userProfile.name[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button variant="outline" size="sm" onClick={handleChangeAvatarClick}>
                  Change Avatar
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input 
                id="age" 
                type="number" 
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
            <div>
              <Label>Pronouns</Label>
              <Select value={pronouns} onValueChange={setPronouns}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pronouns">
                    {getPronounDisplay(parseInt(pronouns))}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">They/Them</SelectItem>
                  <SelectItem value="2">She/Her</SelectItem>
                  <SelectItem value="3">He/Him</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSaveChanges} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="text-indigo-600" size={20} />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Helper Type</Label>
              <Select value={helperType} onValueChange={setHelperType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="therapist">Therapist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred Tone</Label>
              <Select value={preferredTone} onValueChange={setPreferredTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gentle">Gentle</SelectItem>
                  <SelectItem value="direct">Direct</SelectItem>
                  <SelectItem value="encouraging">Encouraging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdatePreferences} disabled={isPrefLoading}>
              {isPrefLoading ? 'Updating...' : 'Update Preferences'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="text-indigo-600" size={20} />
              Privacy & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              Export Journal Data
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                >
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-4">
                  <Label htmlFor="delete-confirm">
                    Type <strong>DELETE My Account</strong> to confirm:
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="Type DELETE My Account here"
                    className="mt-2"
                  />
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={!isDeleteEnabled}
                    className={!isDeleteEnabled ? 'opacity-50 cursor-not-allowed' : ''}
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="text-indigo-600" size={20} />
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = 'mailto:info@ensele.com?subject=Support Request'}
            >
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.location.href = 'mailto:info@ensele.com?subject=Feature Request - Suggestion for Improvement'}
            >
              Suggest Improvements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};